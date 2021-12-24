import axios from "./../../../../utils/axios-header";
import React from "react";
import { Header, Loader, Message, Table, Icon, Dimmer } from "semantic-ui-react";

export default (props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [top, setTop] = React.useState(0);
    const [sort, setSort] = React.useState({});

    const searchParams = new URLSearchParams(props.location.search);

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

    React.useEffect(() => {

        const header = document.getElementById('header-menu');
        setTop(header?.offsetHeight || 0);

        axios.post('dev/block/statistic').then(({ data }) => {

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

            setRows(data.rows);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        if (Object.keys(sort).length > 0) {

            for (let i in sort)
                searchParams.set(i, sort[i]);

            let search = searchParams.toString();

            if (search !== "") {
                props.history.replace(`${props.location.pathname}?${search}`)
            }

        }

    }, [sort]);

    return <div className="pb-3">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Статистика посещений"
                subheader={`Статистика посещений за текущий день`}
            />

        </div>

        {loading ? <Loader active inline="centered" /> : null}

        {error && !loading && <Message error content={error} />}

        {!error && !loading && rows && rows.length === 0 && <Message info className="text-center">Данных нет</Message>}

        {!error && !loading && rows && rows.length > 0 && <Table compact celled sortable className="blocks-table">

            <Table.Header style={{ top, zIndex: 100 }} className="position-sticky">
                <Table.Row>
                    <Table.HeaderCell>IP адрес</Table.HeaderCell>
                    <Table.HeaderCell>Хост</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'visits' ? sort.direction : null}
                        onClick={() => startSort('visits')}
                        title="Посещения сегодня до блокировки"
                    >Посещений</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'requests' ? sort.direction : null}
                        onClick={() => startSort('requests')}
                        title="Зафиксировано оставления заявок через сайты"
                    >Заявок</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'requestsAll' ? sort.direction : null}
                        onClick={() => startSort('requestsAll')}
                        title="Заявок за все время"
                    >Заявок всего</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'queues' ? sort.direction : null}
                        onClick={() => startSort('queues')}
                        title="Поступило запросов в очередь сегодня"
                    >Очередь</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'queuesAll' ? sort.direction : null}
                        onClick={() => startSort('queuesAll')}
                        title="Поступило запросов в очередь за все время"
                    >Вся очередь</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'drops' ? sort.direction : null}
                        onClick={() => startSort('drops')}
                        title="Попыток входа на сайт после блокировки"
                    >Блок. входы</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={sort.column === 'all' ? sort.direction : null}
                        onClick={() => startSort('all')}
                        title="Посещения за все время"
                    >Все посещения</Table.HeaderCell>
                    <Table.HeaderCell>{' '}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {rows.map(row => <StatisticDayRow
                    key={row.ip}
                    row={row}
                    setBlockIp={props.setBlockIp}
                    setRows={setRows}
                    history={props.history}
                />)}
            </Table.Body>

        </Table>}

    </div>

});

const StatisticDayRow = ({ row, setBlockIp, setRows, history }) => {

    const [load, setLoad] = React.useState(false);

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

    return <Table.Row
        negative={row.blocked_on}
        warning={!row.blocked_on && row.autoblock}
        title={row.blocked
            ? "IP адрес имеется в черном списке"
            : (!row.blocked && row.autoblock
                ? "Автоматически заблокировано после оставления нескольких заявок"
                : null
            )
        }
        textAlign="center"
    >
        <Table.Cell warning={row.autoblock} textAlign="left">
            <a onClick={() => history.push(`/admin/block/ip?addr=${row.ip}`)} style={{ cursor: "pointer" }}>{row.ip}</a>
        </Table.Cell>
        <Table.Cell textAlign="left">
            {row.host}
        </Table.Cell>
        <Table.Cell>
            <span className={row.visits > 0 ? 'opacity-100' : 'opacity-30'}>{row.visits || 0}</span>
        </Table.Cell>
        <Table.Cell>
            <span className={row.requests > 0 ? 'opacity-100' : 'opacity-30'}>{row.requests || 0}</span>
        </Table.Cell>
        <Table.Cell>
            <span className={row.requestsAll > 0 ? 'opacity-100' : 'opacity-30'}>{row.requestsAll || 0}</span>
        </Table.Cell>
        <Table.Cell>
            <span className={row.queues > 0 ? 'opacity-100' : 'opacity-30'}>{row.queues || 0}</span>
        </Table.Cell>
        <Table.Cell>
            <span className={row.queuesAll > 0 ? 'opacity-100' : 'opacity-30'}>{row.queuesAll || 0}</span>
        </Table.Cell>
        <Table.Cell>
            <span className={row.drops > 0 ? 'opacity-100' : 'opacity-30'}>{row.drops || 0}</span>
        </Table.Cell>
        <Table.Cell>
            <span className={row.all > 0 ? 'opacity-100' : 'opacity-30'}>{row.all || 0}</span>
        </Table.Cell>
        <Table.Cell className="position-relative" warning={row.blocked && !row.blocked_on}>
            <div className="d-flex justify-content-center align-items-center">
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
                    <Icon
                        name="chart bar"
                        color="green"
                        className="button-icon mx-1"
                        title="Статистика по ip-адресу"
                        onClick={() => history.push(`/admin/block/ip?addr=${row.ip}`)}
                    />
                </span>
                <span>
                    <Icon
                        name="eye"
                        color="black"
                        className="button-icon mx-1"
                        title="Все просмотры страниц сайтов с ip"
                        onClick={() => history.push(`/admin/block/views?ip=${row.ip}`)}
                    />
                </span>
            </div>

            {load && <Dimmer active inverted>
                <Loader active size="tiny" />
            </Dimmer>}
        </Table.Cell>
    </Table.Row>
};