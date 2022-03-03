import { useState, useCallback } from "react";
import { Table, Icon, Placeholder } from "semantic-ui-react";
import { FlagIp, getIpInfo } from "../Statistic";

const TableBodyRow = props => {

    const { row, setRows } = props;
    const [infoCheck, setInfoCheck] = useState(false);

    const checkIp = useCallback(ip => {
        setInfoCheck(true);
        getIpInfo(ip, data => {
            setInfoCheck(false);
            setRows(prev => {
                let rows = [...prev];
                rows.forEach((row, i) => {
                    if (row.ip === data.ip) {
                        rows[i].info = data;
                    }
                });
                return rows;
            });
        });
    }, []);

    return <Table.Row
        negative={!row.our_ip && row.is_blocked}
        warning={!row.our_ip && !row.is_blocked && row.is_autoblock}
        positive={row.our_ip}
        textAlign="center"
    >
        <Table.Cell textAlign="left" warning={row.is_autoblock}>
            <div className="d-flex align-items-center">

                {row.info && !infoCheck && <FlagIp
                    name={row.info.country_code}
                    title={`${row.info.region_name}, ${row.info.city}`}
                />}

                {row.info && !infoCheck && typeof row.info.country_code != "string" && <span
                    className="unknow-flag loading"
                    title="Информация недоступна"
                />}

                {!row.info && !infoCheck && <span
                    className="unknow-flag"
                    title="Проверить информацию"
                    onClick={() => checkIp(row.ip)}
                />}

                {infoCheck && <span
                    className="unknow-flag loading"
                    title="Поиск информации"
                    children={<Placeholder className="h-100 w-100" />}
                />}

                <span>{row.ip}</span>

                {row.our_ip && <span>
                    <Icon
                        name="check"
                        color="green"
                        className="ml-1 mr-0"
                        title="Наш IP"
                    />
                </span>}

                {row.is_autoblock && <span>
                    <Icon
                        name="window close"
                        color="yellow"
                        className="ml-1 mr-0"
                        title="Автоматическая блокировка"
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
                        name={row.is_blocked ? "minus square" : "ban"}
                        color={row.blocks_all ? "red" : "orange"}
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