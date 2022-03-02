import { Table, Icon } from "semantic-ui-react";

const TableBodyRow = props => {

    const { row } = props;

    return <Table.Row
        negative={!row.our_ip && row.is_blocked}
        warning={!row.our_ip && !row.is_blocked && row.is_autoblock}
        positive={row.our_ip}
        textAlign="center"
    >
        <Table.Cell textAlign="left" warning={row.is_autoblock}>
            <div className="d-flex align-items-center">
                <span>{row.ip}</span>
                {row.our_ip && <span>
                    <Icon
                        name="check"
                        color="green"
                        className="ml-2 mr-0"
                        title="Наш IP"
                    />
                </span>}
            </div>
        </Table.Cell>
        <Table.Cell textAlign="left"><small>{row.host}</small></Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.visits > 0 ? 100 : 30}`}>
                {row.visits || 0}
            </span>
        </Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.visits_all > 0 ? 100 : 30}`}>
                {row.visits_all || 0}
            </span>
        </Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.requests > 0 ? 100 : 30}`}>
                {row.requests || 0}
            </span>
        </Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.requests_all > 0 ? 100 : 30}`}>
                {row.requests_all || 0}
            </span>
        </Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.queues > 0 ? 100 : 30}`}>
                {row.queues || 0}
            </span>
        </Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.queues_all > 0 ? 100 : 30}`}>
                {row.queues_all || 0}
            </span>
        </Table.Cell>
        <Table.Cell>
            <span className={`opacity-${row.visits_drop > 0 ? 100 : 30}`}>
                {row.visits_drop || 0}
            </span>
        </Table.Cell>
        <Table.Cell style={{ fontSize: "120%" }}>
            <div className="d-flex justify-content-center align-items-center">

                <span>
                    <Icon
                        name="ban"
                        color={row.is_blocked ? "red" : "orange"}
                        className="button-icon mx-1"
                        title={row.is_blocked ? "Разблокировать" : "Заблокировать ip адрес"}
                        onClick={() => props.block(row.ip)}
                    />
                </span>

                <a
                    href={`/admin/block/ip?addr=${row.ip}`}
                    onClick={e => {
                        e.preventDefault();
                        props.history.push(`/admin/block/ip?addr=${row.ip}`);
                    }}
                >
                    <Icon
                        name="chart bar"
                        color="green"
                        className="button-icon mx-1"
                        title="Статистика по ip-адресу"
                    />
                </a>

                <a
                    href={`/admin/block/views?ip=${row.ip}`}
                    onClick={e => {
                        e.preventDefault();
                        props.history.push(`/admin/block/views?ip=${row.ip}`);
                    }}
                >
                    <Icon
                        name="eye"
                        color="black"
                        className="button-icon mx-1"
                        title="Все просмотры страниц сайтов с ip"
                    />
                </a>

            </div>
        </Table.Cell>
    </Table.Row>

}

export default TableBodyRow;