import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Header, Input, Icon, Placeholder, Select } from "semantic-ui-react";
import { axios, Highlighted } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import BlockModal from "../BlockModal";
import PagesPagination from "./PagesPagination";
import CreateBlockIp from "./CreateBlockIp";
import { FlagIp, getIpInfo } from "../Statistic";
import { withRouter } from "react-router-dom";
import BlockDriveInfo from "./BlockDriveInfo";

const BlockDriveIp = () => {

    const [loading, setLoading] = useState(true);
    const [load, setLoad] = useState(true);

    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [block, setBlock] = useState(null);

    const [searchWord, setSearchWord] = useState("");
    const [search, setSearch] = useState(false);
    const [filters, setFilters] = useState({});
    const [sites, setSites] = useState([]);

    const getRows = params => {

        setLoad(true);
        setPage(params?.page || 1);

        axios.post('dev/block/drive/ip', { ...params }).then(({ data }) => {
            setRows(data.rows);
            setPages(data.pages);
            setTotal(data.total);
            Boolean(data.sites) && setSites([
                { key: 0, value: null, text: "Все сайты" },
                ...data.sites
            ]);
        }).catch(e => {
            axios.toast(axios.getError(e));
        }).then(() => {
            setLoad(false);
            setLoading(false);
            setSearch(false);
        });

    };

    useEffect(() => getRows({}), []);

    // useEffect(() => {
    //     if (page > 0) getRows({ page });
    // }, [page]);

    useEffect(() => {
        if (Boolean(search) || Boolean(filters)) getRows({ page: 1, search: searchWord, ...filters });
    }, [search, filters]);

    return <div style={{ maxWidth: 800 }}>

        {block && <BlockModal
            ip={block}
            open={block !== null}
            close={() => setBlock(null)}
            setRows={setRows}
        />}

        <AdminContentSegment className="d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Управление блокировками IP"
                subheader="Блокировка и разблокировка ip адресов"
                className="flex-grow-1"
            />

            {!loading && <CreateBlockIp
                setRows={setRows}
                setBlock={setBlock}
            />}

        </AdminContentSegment>

        <AdminContentSegment>Пояснение кнопки блокировки: <Icon name="list ul" color="green" fitted /> адрес не заблокирован нигде, <Icon name="list ul" color="orange" fitted /> адрес заблокирован на некоторых сайтах, на которых имеется статистика и учет блокировки, <Icon name="list ul" color="red" fitted /> адрес заблокирован на всех сайтах. <Icon name="circle plus" color="green" fitted /> при нажатии на эту кнопку ip будет заблокирован на всех сайтах, <Icon name="circle minus" color="red" fitted /> - будет разблокирован на всех сайтах. <Icon name="window close" color="yellow" fitted /> имеется автоматическая блокировка на одном из сайтов.</AdminContentSegment>

        <AdminContentSegment>

            <Input
                action={{
                    color: "blue",
                    icon: "search",
                    content: "Найти",
                    onClick: () => (!loading && !load) ? setSearch(true) : null,
                    loading: load,
                }}
                placeholder="Введите IP-адрес или имя хоста..."
                fluid
                value={searchWord}
                disabled={loading || load}
                onChange={(e, { value }) => setSearchWord(value)}
                onKeyUp={e => e.keyCode === 13 ? setSearch(true) : null}
            />

            <div className="mt-3 d-flex align-items-center">

                <Select
                    options={sites}
                    disabled={loading || load}
                    placeholder="Выберите сайт"
                    value={filters.site || null}
                    onChange={(e, { value }) => {
                        setFilters(prev => ({ ...prev, site: value }));
                    }}
                />

                <div className="flex-grow-1 ml-4">
                    <Checkbox
                        label="Только IPv4"
                        className="mr-4"
                        disabled={loading || load}
                        checked={filters.ipv4 || false}
                        onChange={(e, { checked }) => setFilters(prev => ({ ...prev, ipv4: checked }))}
                    />
                    <Checkbox
                        label="Только IPv6"
                        className="mr-4"
                        disabled={loading || load}
                        checked={filters.ipv6 || false}
                        onChange={(e, { checked }) => setFilters(prev => ({ ...prev, ipv6: checked }))}
                    />
                </div>

                {total > 0 && <div>Найдено: <b>{total}</b></div>}

            </div>

        </AdminContentSegment>

        {pages > 1 && <PagesPagination
            pages={pages}
            page={page}
            loading={loading || load}
            getRows={getRows}
            search={searchWord}
        />}

        {rows && rows.length > 0 && rows.map((row, key) => <BlockDriveIpRow
            key={key}
            row={row}
            loading={loading || load}
            block={setBlock}
            setRows={setRows}
            search={searchWord}
        />)}

        {rows && !(loading || load) && rows.length === 0 && <AdminContentSegment className="text-center py-5">
            <strong className="opacity-50">Ничего не найдено</strong>
        </AdminContentSegment>}

        {pages > 1 && <PagesPagination
            pages={pages}
            page={page}
            loading={loading || load}
            getRows={getRows}
            search={searchWord}
        />}

    </div>
}

const BlockDriveIpRow = withRouter(props => {

    const { row, loading, setRows, search } = props;
    const button = {
        icon: "ban",
        color: "green",
        title: "Заблокировать",
    };

    const [checkedIp, setCheckedIp] = useState(false);
    const [load, setLoad] = useState(false);

    if (row.blocks_all) {
        button.icon = "minus";
        button.color = "red";
        button.title = "Редактировать блокировки по сайтам";
    } else if (row.is_blocked) {
        button.icon = "minus";
        button.color = "orange";
        button.title = "Редактировать блокировки по сайтам";
    }

    let ip = row.ip,
        hostname = row.hostname;

    if (search !== "" && search) {
        ip = <Highlighted text={row.ip} highlight={search} />

        if (row.hostname)
            hostname = <Highlighted text={row.hostname} highlight={search} />
    }

    const checkIp = useCallback(ip => {

        setCheckedIp(true);

        getIpInfo(ip, data => {
            setRows(prev => {
                prev.forEach((row, i) => {
                    if (data.ip === row.ip) {
                        prev[i].info = data;
                    }
                });
                return prev;
            });

            setCheckedIp(false);
        });

    }, []);

    const blockAll = useCallback(row => {

        setLoad(true);

        axios.post('dev/block/site/setblockipall', {
            ip: row.ip,
            checked: !Boolean(row.blocks_all),
            is_period: row.is_period,
            period_data: row.period_data,
        }).then(({ data }) => {
            setRows(prev => {
                prev.forEach((row, i) => {
                    if (data.ip === row.ip) {

                        prev[i].blocks_all = data.blocks_all;
                        prev[i].is_blocked = data.is_blocked;

                        if (typeof prev[i].blocks == "object" && typeof data.blokeds == "object") {
                            prev[i].blocks.forEach((b, k) => {
                                prev[i].blocks[k].block = Boolean(data.blokeds[b.id]);
                            });
                        }
                    }
                });
                return prev;
            });
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoad(false);
        });

    }, []);

    return <AdminContentSegment className="mb-2">

        <div className="d-flex align-items-center">

            <Header
                as="h4"
                content={<div>
                    {row.is_period
                        ? ip
                        : <a style={{ cursor: "pointer" }} onClick={() => props.history.push(`/admin/block/ip?addr=${row.ip}`)}>{ip}</a>
                    }
                </div>}
                subheader={<div className="sub header d-flex align-items-center">

                    {checkedIp && <span className="unknow-flag loading" title="Поиск информации">
                        <Placeholder className="h-100 w-100" />
                    </span>}

                    {row.is_period !== true && !checkedIp && <>

                        {typeof row.info?.country_code != "undefined" && <FlagIp
                            name={row.info.country_code}
                            title={`${row.info.region_name}, ${row.info.city}`}
                        />}

                        {row.info && row.info.country_code === null && <span
                            className="unknow-flag loading"
                            title="Информация недоступна"
                        />}

                        {typeof row.info?.country_code == "undefined" && <span
                            className="unknow-flag"
                            title="Проверить информацию"
                            onClick={() => checkIp(row.ip)}
                        />}

                    </>}

                    <span>{hostname}</span>

                    {Boolean(row.comment) && <span className="ml-3">
                        <Icon name="comment" className="mr-1" />
                        {row.comment}
                    </span>}

                </div>}
                className="flex-grow-1"
                disabled={loading}
            />

            <div className="d-flex align-items-center">

                {/* <span>
                    <Icon
                        name={row.blocks_all ? "minus circle" : "plus circle"}
                        color={row.blocks_all ? "red" : "green"}
                        title={`${row.blocks_all ? "Разбловировать" : "Заблокировать"} на всех сайтах`}
                        disabled={loading || load}
                        link
                    />
                </span>

                <span>
                    <Icon
                        name="list ul"
                        color={row.blocks_all ? "red" : "green"}
                        title={`${row.blocks_all ? "Разбловировать" : "Заблокировать"} на всех сайтах`}
                        disabled={loading || load}
                        link
                    />
                </span> */}

                {row.is_autoblock && <Button
                    size="mini"
                    icon="window close"
                    color="yellow"
                    title="Имется автоматическая блокировка"
                    disabled
                    className="d-flex align-items-center"
                />}

                <Button
                    size="mini"
                    icon={row.blocks_all ? "minus circle" : "plus circle"}
                    color={row.blocks_all ? "red" : "green"}
                    title={`${row.blocks_all ? "Разбловировать" : "Заблокировать"} на всех сайтах`}
                    disabled={loading || load}
                    loading={load}
                    onClick={() => blockAll(row)}
                    className="d-flex align-items-center"
                />
                <Button
                    size="mini"
                    {...button}
                    icon="list ul"
                    disabled={loading}
                    onClick={() => props.block(row.ip)}
                    className="d-flex align-items-center"
                />
            </div>

        </div>

    </AdminContentSegment >

});

export default BlockDriveIp;