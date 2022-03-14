import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Header, Input, Placeholder } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import BlockModal from "../BlockModal";
import PagesPagination from "./PagesPagination";
import CreateBlockIp from "./CreateBlockIp";
import { FlagIp, getIpInfo } from "../Statistic";

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

    const getRows = useCallback(params => {

        setLoad(true);
        setPage(params?.page || 1);

        axios.post('dev/block/drive/ip', { ...params, ...filters }).then(({ data }) => {
            setRows(data.rows);
            setPages(data.pages);
            setTotal(data.total);
        }).catch(e => {

        }).then(() => {
            setLoad(false);
            setLoading(false);
            setSearch(false);
        });

    }, [page, searchWord, filters]);

    useEffect(() => getRows({}), []);

    // useEffect(() => {
    //     if (page > 0) getRows({ page });
    // }, [page]);

    useEffect(() => {
        if (search) getRows({ page: 1, search: searchWord });
    }, [search]);

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

                <div className="flex-grow-1">
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
        />}

        {rows && rows.length > 0 && rows.map((row, key) => <BlockDriveIpRow
            key={key}
            row={row}
            loading={loading || load}
            block={setBlock}
            setRows={setRows}
        />)}

        {rows && !(loading || load) && rows.length === 0 && <AdminContentSegment className="text-center py-5">
            <strong className="opacity-50">Ничего не найдено</strong>
        </AdminContentSegment>}

        {pages > 1 && <PagesPagination
            pages={pages}
            page={page}
            loading={loading || load}
            getRows={getRows}
        />}

    </div>
}

const BlockDriveIpRow = props => {

    const { row, loading, setRows } = props;
    const button = {
        icon: "ban",
        color: "green",
        title: "Заблокировать",
    };

    const [checkedIp, setCheckedIp] = useState(false);

    if (row.blocks_all) {
        button.icon = "minus";
        button.color = "red";
        button.title = "Редактировать блокировки по сайтам";
    } else if (row.is_blocked) {
        button.icon = "minus";
        button.color = "orange";
        button.title = "Редактировать блокировки по сайтам";
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

    return <AdminContentSegment className="mb-2">

        <div className="d-flex align-items-center">

            <Header
                as="a"
                content={row.ip}
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

                    <span>{row.hostname}</span>

                </div>}
                className="flex-grow-1"
                disabled={loading}
            />

            <div>
                <Button
                    size="mini"
                    {...button}
                    disabled={loading}
                    onClick={() => props.block(row.ip)}
                />
            </div>

        </div>

    </AdminContentSegment >

}

export default BlockDriveIp;