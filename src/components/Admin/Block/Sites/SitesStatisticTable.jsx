import { useEffect, useState, useRef, useCallback } from "react";
import { withRouter } from "react-router-dom";
import { Loader, Message, Table, Icon, Header, Dimmer, Placeholder } from "semantic-ui-react";
import { axios } from "../../../../utils";
import AdminContentSegment from "../../UI/AdminContentSegment";
import { setBlockIp } from "../Block";
import { Line } from '@antv/g2plot';
import moment from "moment";
import FlagIp from "../Statistic/IP/FlagIp";
import getIpInfo from "../Statistic/IP/getIpInfo";

const SitesStatisticTable = props => {

    const searchParams = new URLSearchParams(props.location.search);

    const { site, history, setAddBlockId, updateRow } = props;
    const { loading, setLoading } = props;
    const [load, setLoad] = useState(null);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [top, setTop] = useState(0);
    const [sort, setSort] = useState({});

    const [loadChart, setLoadChart] = useState(false);
    const [chart, setChart] = useState([]);

    const startSort = column => {

        let direction = column === sort.column
            ? sort.direction === "ascending" ? "descending" : "ascending"
            : "descending";

        setSort({ column, direction });

        setRows(prev => prev.sort((a, b) => {
            return direction === "ascending"
                ? a[column] - b[column]
                : b[column] - a[column]
        }));

    }


    const blockIp = async ip => {

        if (load) return;

        setLoad(true);

        await setBlockIp(
            { ip },
            data => {
                setRows(prev => {

                    prev.forEach((row, i) => {
                        if (row.ip === data.row.host || (row.host && row.host.indexOf(data.row.host) >= 0)) {
                            prev[i].blocked = data.blocked;
                            prev[i].blocked_on = data.blocked_on;
                        }
                    });

                    return prev;
                });

            },
            e => axios.toast(e)
        );

        setLoad(false);

    }

    const checkIp = ip => {

        setRows(prev => {
            let list = [...prev];
            list.forEach((row, i) => {
                if (row.ip === ip)
                    list[i].info_check = true;
            });
            return list;
        });

        getIpInfo(ip, data => {
            setRows(prev => {
                let list = [...prev];
                list.forEach((row, i) => {
                    if (row.ip === data.ip)
                        list[i].info = data;
                    list[i].info_check = false;
                });
                return list;
            });
        });

    }

    useEffect(() => {

        if (site) {

            setLoading(true);
            setLoadChart(true);
            setChart([]);

            const header = document.getElementById('header-menu');
            setTop(header?.offsetHeight || 0);

            axios.post('dev/block/sitesStats', { site: site }).then(({ data }) => {

                setSort({});
                setRows(data.rows);
                setError(null);

                let column = searchParams.get('column');
                let direction = searchParams.get('direction');

                if (column && direction) {

                    data.rows.sort((a, b) => {
                        return direction === "ascending"
                            ? a[column] - b[column]
                            : b[column] - a[column]
                    });

                    setSort({ column, direction });
                }

                axios.post('dev/block/getChartSite', { site: site }).then(({ data }) => {
                    setChart(data.chart || []);
                }).catch(e => {
                    axios.toast("Ошибка загрузки графика");
                }).then(() => {
                    setLoadChart(false);
                });

            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [site]);

    useEffect(() => {

        if (site)
            searchParams.set("site", site);

        if (Object.keys(sort).length > 0) {
            for (let i in sort)
                searchParams.set(i, sort[i]);
        }

        let search = searchParams.toString();

        if (search !== "") {
            props.history.replace(`?${search}`)
        }

    }, [sort, site]);

    useEffect(() => {

        if (updateRow?.ip) {
            setRows(prev => {

                prev.forEach((row, i) => {
                    if (row.ip === updateRow.ip) {
                        prev[i].blocked_client_id = updateRow.block_client_id;
                    }
                });

                return prev;
            });
        }

    }, [updateRow]);

    if (loading)
        return <Loader inline="centered" active />

    if (error)
        return <Message error content={error} style={{ maxWidth: 600 }} className="mx-auto" />

    return <>

        {!site && <Message
            info
            content="Необходимо выбрать сайт"
            style={{ maxWidth: 800 }}
            className="mx-auto"
        />}

        {site && <AdminContentSegment>
            <Header as="h5" content={`График посещений ${site}`} className="mb-3" />
            <Lines data={chart} />
            {loadChart && <Dimmer active inverted><Loader /></Dimmer>}
        </AdminContentSegment>}

        {site && <Table compact="very" celled sortable selectable className="blocks-table mb-4">

            <Table.Header style={{ top, zIndex: 1 }} className="position-sticky" id="header-table-data">
                <Table.Row>
                    <Table.HeaderCell>IP адрес</Table.HeaderCell>
                    <Table.HeaderCell>Имя хоста</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'visits' ? sort.direction : null}
                        onClick={() => startSort('visits')}
                        title="Посещения сегодня"
                        content="Посещения сегодня"
                    />
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'visitsAll' ? sort.direction : null}
                        onClick={() => startSort('visitsAll')}
                        title="Всего посещений"
                        content="Всего посещений"
                    />
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'requests' ? sort.direction : null}
                        onClick={() => startSort('requests')}
                        title="Заявок сегодня"
                        content="Заявок сегодня"
                    />
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'requestsAll' ? sort.direction : null}
                        onClick={() => startSort('requestsAll')}
                        title="Всего заявок"
                        content="Всего заявок"
                    />
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'queues' ? sort.direction : null}
                        onClick={() => startSort('queues')}
                        title="Очередь сегодня"
                        content="Очередь сегодня"
                    />
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'queuesAll' ? sort.direction : null}
                        onClick={() => startSort('queuesAll')}
                        title="Заявок в очереди за все время"
                        content="Вся очередь"
                    />
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows && rows.length === 0 && <Table.Row>
                    <Table.Cell
                        colSpan={9}
                        content={<div className="my-5 opacity-50 text-center">Данных еще нет</div>}
                    />
                </Table.Row>}

                {rows && rows.length > 0 && rows.map(row => <Table.Row
                    key={row.ip}
                    textAlign="center"
                    negative={!row.our_ip && row.blocked_on}
                    warning={!row.our_ip && !row.blocked_on && row.autoblock}
                    positive={row.our_ip}
                    title={row.our_ip ? "Это наш IP адрес" : (row.blocked
                        ? "IP адрес имеется в черном списке"
                        : (!row.blocked && row.autoblock
                            ? "Автоматически заблокировано после оставления нескольких заявок"
                            : null
                        )
                    )}
                >
                    <Table.Cell
                        warning={row.autoblock}
                        textAlign="left"
                        content={<div className="d-flex align-items-center">
                            <span>
                                {row.info && !row.info_check && <FlagIp
                                    name={row.info.country_code}
                                    title={`${row.info.region_name}, ${row.info.city}`}
                                />}

                                {!row.info && !row.info_check &&
                                    <span className="unknow-flag" title="Проверить информацию" onClick={() => checkIp(row.ip)}></span>
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
                            <a
                                onClick={() => history.push(`/admin/block/ip?addr=${row.ip}`)}
                                style={{ cursor: "pointer" }}
                                children={row.ip}
                            />
                            {row.our_ip && <span><Icon name="check" color="green" className="ml-2 mr-0" title="Наш IP" /></span>}
                        </div>}
                    />
                    <Table.Cell
                        textAlign="left"
                        content={<small>{row.host}</small>}
                    />
                    <Table.Cell
                        content={<span
                            children={row.visits}
                            className={row.visits > 0 ? 'opacity-100' : 'opacity-30'}
                        />}
                    />
                    <Table.Cell
                        content={<span
                            children={row.visitsAll}
                            className={row.visitsAll > 0 ? 'opacity-100' : 'opacity-30'}
                        />}
                    />
                    <Table.Cell
                        content={<span
                            children={row.requests}
                            className={row.requests > 0 ? 'opacity-100' : 'opacity-30'}
                        />}
                    />
                    <Table.Cell
                        content={<span
                            children={row.requestsAll}
                            className={row.requestsAll > 0 ? 'opacity-100' : 'opacity-30'}
                        />}
                    />
                    <Table.Cell
                        content={<span
                            children={row.queues}
                            className={row.queues > 0 ? 'opacity-100' : 'opacity-30'}
                        />}
                    />
                    <Table.Cell
                        content={<span
                            children={row.queuesAll}
                            className={row.queuesAll > 0 ? 'opacity-100' : 'opacity-30'}
                        />}
                    />
                    <Table.Cell
                        warning={row.blocked && !row.blocked_on}
                        content={<div className="d-flex justify-content-center align-items-center">
                            <span>
                                <Icon
                                    name={row.blocked_on ? "minus square" : "ban"}
                                    color={row.blocked_on ? "red" : "orange"}
                                    className="button-icon mx-1"
                                    title={row.blocked_on ? "Разблокировать" : (row.blocked ? "Включить блокировку" : "Заблокировать ip адрес")}
                                    onClick={() => blockIp(row.ip)}
                                />
                            </span>
                            <span>
                                <a
                                    href={`/admin/block/ip?addr=${row.ip}`}
                                    onClick={e => {
                                        e.preventDefault();
                                        history.push(`/admin/block/ip?addr=${row.ip}`);
                                    }}
                                >
                                    <Icon
                                        name="chart bar"
                                        color="green"
                                        className="button-icon mx-1"
                                        title="Статистика по ip-адресу"
                                    />
                                </a>
                            </span>
                            <span>
                                <a
                                    href={`/admin/block/views?ip=${row.ip}&site=${site}`}
                                    onClick={e => {
                                        e.preventDefault();
                                        history.push(`/admin/block/views?ip=${row.ip}&site=${site}`);
                                    }}
                                >
                                    <Icon
                                        name="eye"
                                        color="black"
                                        className="button-icon mx-1"
                                        title="Все просмотры страниц сайтов с ip"
                                    />
                                </a>
                            </span>
                            <span>
                                <Icon
                                    name={row.blocked_client_id ? "minus square" : "ban"}
                                    color="blue"
                                    className="button-icon mx-1"
                                    title="Заблокировать IP по ID"
                                    onClick={() => setAddBlockId(row)}
                                />
                            </span>
                        </div>}
                    />
                </Table.Row>)}

            </Table.Body>

        </Table>
        }

    </>

}

export const Lines = ({ data }) => {

    const div = useRef();
    const plot = useRef();
    const rows = data.map(row => {

        let name = row.name;

        if (row.name === "hosts")
            name = "Посетители";
        else if (row.name === "views")
            name = "Просмотры";

        return { ...row, name }
    });

    useEffect(() => {

        if (!plot.current) {

            plot.current = new Line(div.current, {
                data: rows,
                isGroup: true,
                xField: 'date',
                yField: 'value',
                seriesField: 'name',
                height: 250,
                xAxis: {
                    label: {
                        formatter: date => moment(date).format("DD.MM.YY"),
                    }
                },
            });

            plot.current.render();

        }
        else {
            plot.current && plot.current.changeData(rows);
        }

    }, [rows]);

    return <div ref={div}></div>;
};

export default withRouter(SitesStatisticTable);