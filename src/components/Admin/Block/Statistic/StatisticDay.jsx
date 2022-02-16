import axios from "./../../../../utils/axios-header";
import React from "react";
import { Header, Loader, Message, Table, Icon, Dimmer, Placeholder, Dropdown, Checkbox, Button } from "semantic-ui-react";
import FlagIp from "./IP/FlagIp";
import getIpInfo from "./IP/getIpInfo";

export default (props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [top, setTop] = React.useState(0);
    const [sort, setSort] = React.useState({});

    const searchParams = new URLSearchParams(props.location.search);

    const sortable = React.useCallback((a, b, column, direction) => {

        let columns = column.split(",");

        let sortable_a = a[column];
        let sortable_b = b[column];

        for (var i = 0, l = columns.length; i < l; i++) {

            column = columns[i];

            sortable_a = a[column];
            sortable_b = b[column];

            if (typeof sortable_a == "undefined") return 0;

            if (column === "host" || column === "ip") {
                sortable_a = String(sortable_a).toLowerCase();
                sortable_b = String(sortable_b).toLowerCase();
            }

            if (direction === "ascending") {
                if (sortable_a > sortable_b) return 1;
                if (sortable_a < sortable_b) return -1;
            } else {
                if (sortable_a > sortable_b) return -1;
                if (sortable_a < sortable_b) return 1;
            }

        }

        return 0;
    }, []);

    const startSort = column => {

        let direction = column === sort.column
            ? sort.direction === "ascending" ? "descending" : "ascending"
            : "descending";

        setSort({ column, direction });
        setRows(prev => prev.sort((a, b) => sortable(a, b, column, direction)));
    }

    React.useEffect(() => {

        const header = document.getElementById('header-menu');
        setTop(header?.offsetHeight || 0);

        axios.post('dev/block/statistic').then(({ data }) => {

            let column = searchParams.get('column');
            let direction = searchParams.get('direction');

            if (column && direction) {
                data.rows.sort((a, b) => sortable(a, b, column, direction));
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

    const onChangeSortColumn = (e, { checked, value }) => {

        const columns = String(sort?.column).split(",");
        let key = columns.indexOf(value);

        if (checked && !columns.includes(value)) {
            columns.push(value);
        } else if (!checked && key >= 0) {
            columns.splice(key, 1);
        }

        setSort(prev => ({ ...prev, column: columns.join(",") }));
        setRows(prev => prev.sort((a, b) => sortable(a, b, columns.join(","), sort.direction)));
    }

    const onChangeSortDirection = direction => {
        setSort(prev => ({ ...prev, direction }));
        setRows(prev => prev.sort((a, b) => sortable(a, b, String(sort.column), direction)));
    }

    return <div className="pb-3">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Статистика посещений"
                subheader={`Статистика посещений за текущий день`}
                className="flex-grow-1"
            />

            <div>

                <Dropdown
                    trigger={<Button
                        basic
                        icon="sort"
                        basic
                        circular
                    />}
                    icon={null}
                    simple
                    direction="left"
                    style={{ zIndex: 1001 }}
                    title="Сортировка"
                >
                    <Dropdown.Menu>
                        <Dropdown.Item
                            icon="sort content ascending"
                            text="По возрастанию"
                            active={String(sort?.direction).indexOf("ascending") >= 0}
                            onClick={() => onChangeSortDirection("ascending")}
                        />
                        <Dropdown.Item
                            icon="sort content descending"
                            text="По убыванию"
                            active={String(sort?.direction).indexOf("descending") >= 0}
                            onClick={() => onChangeSortDirection("descending")}
                        />
                        <Dropdown.Divider />
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="host"
                            checked={String(sort?.column).split(",").indexOf("host") >= 0}
                            label="Хост"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="visits"
                            checked={String(sort?.column).split(",").indexOf("visits") >= 0}
                            label="Посещений"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="requests"
                            checked={String(sort?.column).split(",").indexOf("requests") >= 0}
                            label="Заявок"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="requestsAll"
                            checked={String(sort?.column).split(",").indexOf("requestsAll") >= 0}
                            label="Заявок всего"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="queues"
                            checked={String(sort?.column).split(",").indexOf("queues") >= 0}
                            label="Очередь"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="queuesAll"
                            checked={String(sort?.column).split(",").indexOf("queuesAll") >= 0}
                            label="Вся очередь"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="drops"
                            checked={String(sort?.column).split(",").indexOf("drops") >= 0}
                            label="Блок. входы"
                        /></Dropdown.Item>
                        <Dropdown.Item><Checkbox
                            onChange={onChangeSortColumn}
                            value="all"
                            checked={String(sort?.column).split(",").indexOf("all") >= 0}
                            label="Все посещения"
                        /></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </div>

        </div>

        {loading ? <Loader active inline="centered" /> : null}

        {error && !loading && <Message error content={error} />}

        {!error && !loading && rows && rows.length === 0 && <Message info className="text-center">Данных нет</Message>}

        {!error && !loading && rows && rows.length > 0 && <Table sortable compact celled className="blocks-table" selectable>

            <Table.Header style={{ top, zIndex: 100 }} className="position-sticky">
                <Table.Row>
                    <Table.HeaderCell>IP адрес</Table.HeaderCell>
                    <Table.HeaderCell
                        onClick={() => startSort('host')}
                        sorted={String(sort?.column).split(",").indexOf("host") >= 0 ? sort.direction : null}
                    >Хост</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("visits") >= 0 ? sort.direction : null}
                        onClick={() => startSort('visits')}
                        title="Посещения сегодня до блокировки"
                    >Посещений</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("requests") >= 0 ? sort.direction : null}
                        onClick={() => startSort('requests')}
                        title="Зафиксировано оставления заявок через сайты"
                    >Заявок</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("requestsAll") >= 0 ? sort.direction : null}
                        onClick={() => startSort('requestsAll')}
                        title="Заявок за все время"
                    >Заявок всего</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("queues") >= 0 ? sort.direction : null}
                        onClick={() => startSort('queues')}
                        title="Поступило запросов в очередь сегодня"
                    >Очередь</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("queuesAll") >= 0 ? sort.direction : null}
                        onClick={() => startSort('queuesAll')}
                        title="Поступило запросов в очередь за все время"
                    >Вся очередь</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("drops") >= 0 ? sort.direction : null}
                        onClick={() => startSort('drops')}
                        title="Попыток входа на сайт после блокировки"
                    >Блок. входы</Table.HeaderCell>
                    <Table.HeaderCell
                        textAlign="center"
                        sorted={String(sort?.column).split(",").indexOf("all") >= 0 ? sort.direction : null}
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

    return <Table.Row
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
        textAlign="center"
    >
        <Table.Cell warning={row.autoblock} textAlign="left">
            <div className="d-flex align-items-center">
                <span>
                    {row.info && !row.info_check &&
                        <FlagIp name={row.info.country_code} title={`${row.info.region_name}, ${row.info.city}`} />
                    }
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
                <a onClick={() => history.push(`/admin/block/ip?addr=${row.ip}`)} style={{ cursor: "pointer" }}>{row.ip}</a>
                {row.our_ip && <span><Icon name="check" color="green" className="ml-2 mr-0" title="Наш IP" /></span>}
            </div>
        </Table.Cell>
        <Table.Cell textAlign="left">
            <small>{row.host}</small>
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
                        href={`/admin/block/views?ip=${row.ip}`}
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/block/views?ip=${row.ip}`);
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
            </div>

            {load && <Dimmer active inverted>
                <Loader active size="tiny" />
            </Dimmer>}
        </Table.Cell>
    </Table.Row>
};