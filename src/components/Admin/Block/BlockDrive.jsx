import React from "react";
import axios from "./../../../utils/axios-header";
import { Header, Placeholder, Message, Input, Checkbox, Icon, Pagination, Statistic } from "semantic-ui-react";
import { setBlockIp } from "./Block";
import { Highlighted } from "./../../../utils";
import FlagIp from "./Statistic/IP/FlagIp";
import getIpInfo from "./Statistic/IP/getIpInfo";

export default (props => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    const [search, setSearch] = React.useState(null);
    const [startSearch, setStartSearch] = React.useState(false);
    const timeout = React.useRef();
    const [changeBlock, setChangeBlock] = React.useState(false);
    const [filters, setFilters] = React.useState({});

    const [pages, setPages] = React.useState(0);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);

    const getRows = formdata => {

        formdata?.search && setLoad(true);

        setLoad(true);

        axios.post('dev/block/getBlockData', {
            ...filters,
            search: search,
            ...formdata,
        }).then(({ data }) => {
            setRows(data.rows);
            setError(null);
            setTotal(data.total);
            setPages(data.pages);
            setPage(data.page);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    React.useEffect(() => {
        getRows({});
    }, [props.location.key]);

    React.useEffect(() => {

        if (startSearch && (search !== "" && search)) {
            clearTimeout(timeout.current);
            getRows({ search, page: 1 });
        }

        return () => setStartSearch(false);

    }, [startSearch]);

    React.useEffect(() => {

        if (Object.keys(filters).length > 0)
            getRows({ search, page: 1, ...filters });

    }, [filters]);

    const onChageSearch = (e, { value }) => {

        setSearch(value);
        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => getRows({ search: value }), 500);

    }

    const setBlock = (e, { id, checked, value }) => {
        if (changeBlock?.id) return;
        setChangeBlock({ id, checked, ip: value });
    }

    React.useEffect(async () => {

        if (changeBlock?.id) {
            await setBlockIp(
                changeBlock,
                data => {
                    setRows(prev => {
                        prev.forEach((row, i) => {
                            if (row.id === data.row.id) {
                                prev[i] = { ...row, block: data.row.block };
                            }
                        });
                        return prev;
                    });
                },
                e => axios.toast(e)
            );

            setChangeBlock(null);
        }

    }, [changeBlock]);

    const checkIp = ip => {

        setRows(prev => {
            let list = [...prev];
            list.forEach((row, i) => {
                if (row.host === ip)
                    list[i].info_check = true;
            });
            return list;
        });

        getIpInfo(ip, data => {
            setRows(prev => {
                let list = [...prev];
                list.forEach((row, i) => {
                    if (row.host === data.ip)
                        list[i].info = data;
                    list[i].info_check = false;
                });
                return list;
            });
        });

    }

    return <div style={{ maxWidth: 600 }}>

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Управление блокировками"
                subheader={`Блокировка и разблокировка ip адреса и/или имени хоста`}
            />

        </div>

        <div className="admin-content-segment">
            <Input
                icon={{
                    name: 'search',
                    link: !loading && !load,
                    onClick: () => (!loading && !load) ? setStartSearch(true) : null,
                }}
                placeholder="Введите IP-адрес или имя хоста..."
                className="w-100"
                disabled={loading}
                loading={load}
                value={search || ""}
                onChange={onChageSearch}
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
        </div>

        {pages > 1 && <PagesPagination
            page={page}
            pages={pages}
            loading={load || loading}
            getRows={getRows}
        />}

        {!loading && error && <Message error content={error} />}
        {!loading && !error && rows.length === 0 && <Message content="Ничего не найдено" />}

        {!loading && !error && rows.length > 0 && <div>
            {rows.map(row => {

                let host = row.host;

                if (search !== "" && search) {
                    host = <Highlighted text={row.host} highlight={search} />
                }

                return <div key={row.id} className="admin-content-segment mb-2">

                    <div className="d-flex justify-content-between align-items-center">

                        <Header
                            disabled={load || false}
                            as="h4"
                            content={<div>
                                {row.is_hostname === 0
                                    ? <a style={{ cursor: "pointer" }} onClick={() => props.history.push(`/admin/block/ip?addr=${row.host}`)}>{host}</a>
                                    : host
                                }
                            </div>}
                            subheader={<div className="sub header d-flex align-items-center">
                                <span>
                                    {row.info && !row.info_check &&
                                        <FlagIp
                                            name={row.info.country_code}
                                            title={`${row.info.region_name}, ${row.info.city}`}
                                        />
                                    }

                                    {!row.info && !row.info_check &&
                                        <span className="unknow-flag" title="Проверить информацию" onClick={() => checkIp(row.host)}></span>
                                    }

                                    {row.info && row.info.country_code === null &&
                                        <span className="unknow-flag loading" title="Информация недоступна"></span>
                                    }

                                    {row.info_check && <span className="unknow-flag loading" title="Поиск информации">
                                        <Placeholder className="h-100">
                                            <Placeholder.Paragraph>
                                                <Placeholder.Line />
                                            </Placeholder.Paragraph>
                                        </Placeholder>
                                    </span>}
                                </span>
                                {row.hostname || "Хост не определен"}
                            </div>}
                            className="m-0"
                        />

                        <div className="d-flex align-items-center">

                            <span>
                                <Icon
                                    name={row.block === 1 ? "ban" : "check"}
                                    color={row.block === 1 ? "red" : "green"}
                                    title={row.block === 1 ? "Заблокировано" : "Доступ открыт"}
                                    className="mr-2"
                                    disabled={load || false}
                                />
                            </span>

                            <Checkbox
                                toggle
                                checked={row.block === 1}
                                onChange={setBlock}
                                id={row.id}
                                disabled={(changeBlock?.id && row.id === changeBlock.id) || load}
                                value={row.host}
                            />

                        </div>

                    </div>

                    <div className={`d-flex justify-content-between align-items-center mt-3 ${load ? `opacity-30` : `opacity-90`}`}>

                        <div className="mx-2" title="Посещений сегодня">
                            Посещений <b>{row.visits || 0}</b>
                        </div>

                        <div className="mx-2" title="Заявок сегодня">
                            Заявок <b>{row.requests || 0}</b>
                        </div>

                        <div className="mx-2" title="Блокированные попытки входя за все время">
                            Блокировано <b>{row.blocks || 0}</b>
                        </div>

                        <div className="mx-2" title="Посещений за все время">
                            Все посещения <b>{row.visitsAll || 0}</b>
                        </div>

                        {/* <Statistic size="mini" title="Посещений сегодня" className="m-0">
                            <Statistic.Label>Посещений</Statistic.Label>
                            <Statistic.Value>{row.visits || 0}</Statistic.Value>
                        </Statistic>

                        <Statistic size="mini" title="Заявок сегодня" className="m-0">
                            <Statistic.Label>Заявок</Statistic.Label>
                            <Statistic.Value>{row.requests || 0}</Statistic.Value>
                        </Statistic>

                        <Statistic size="mini" title="Блокированные попытки входя за все время" className="m-0">
                            <Statistic.Label>Блокировано</Statistic.Label>
                            <Statistic.Value>{row.blocks || 0}</Statistic.Value>
                        </Statistic>

                        <Statistic size="mini" title="Посещений за все время" className="m-0">
                            <Statistic.Label>Все посещения</Statistic.Label>
                            <Statistic.Value>{row.visitsAll || 0}</Statistic.Value>
                        </Statistic> */}
                    </div>

                </div>

            })}
        </div>}

        {pages > 1 && <PagesPagination
            page={page}
            pages={pages}
            loading={load || loading}
            getRows={getRows}
        />}

    </div>
});

const PagesPagination = ({ loading, page, pages, getRows }) => <div className="admin-content-segment mb-3 text-center">
    <Pagination
        activePage={page || 1}
        totalPages={pages}
        disabled={loading}
        pointing
        secondary
        // ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
        prevItem={{ content: <Icon name='angle left' />, icon: true }}
        nextItem={{ content: <Icon name='angle right' />, icon: true }}
        onPageChange={(e, { activePage }) => getRows({ page: activePage })}
    />
</div>