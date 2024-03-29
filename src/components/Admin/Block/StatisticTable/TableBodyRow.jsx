import { useState, useCallback, useEffect } from "react";
import { Table, Icon, Placeholder, Dimmer, Loader } from "semantic-ui-react";
import { axios } from "../../../../utils";
import { FlagIp, getIpInfo } from "../Statistic";

const TableBodyRow = props => {

    const { loading } = props;
    const { row, setRows, showIpInfo, site } = props;
    const [infoCheck, setInfoCheck] = useState(false);
    const [hide, setHide] = useState(false);

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

    useEffect(() => {

        if (hide) {
            axios.post('dev/block/allstatistics/setHideIp', { ip: row.ip, site })
                .then(({ data }) => {
                    setRows(prev => {
                        let rows = [...prev];
                        rows.forEach((row, i) => {
                            if (row.ip === data.ip) {
                                rows[i].is_hide = data.is_hide;
                            }
                        });
                        return rows;
                    });
                })
                .catch(e => axios.toast(e))
                .then(() => setHide(false));
        }

    }, [hide]);

    return <Table.Row
        negative={!row.our_ip && row.is_blocked}
        warning={!row.our_ip && !row.is_blocked && row.is_autoblock}
        positive={row.our_ip}
        textAlign="center"
        disabled={loading}
        className={`${row.is_hide ? "hiden-ip-row" : ""}`}
    >
        <Table.Cell textAlign="left" warning={row.is_autoblock}>
            <div className="d-flex align-items-center">

                {row.info && !infoCheck && <FlagIp
                    name={row.info.country_code}
                    title={`${row.info.region_name}, ${row.info.city}`}
                    onClick={() => {
                        if (typeof showIpInfo == "function") {
                            showIpInfo(row.ip);
                        }
                    }}
                    style={{ cursor: "pointer" }}
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

                <a
                    href={`/admin/block/ip?addr=${row.ip}`}
                    onClick={e => {
                        e.preventDefault();
                        props.history.push(`/admin/block/ip?addr=${row.ip}`);
                    }}
                    style={{ cursor: "pointer" }}
                    children={row.ip}
                />

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

                <span className="ml-1 mr-0 flex-grow-1 d-flex align-items-center justify-content-end">
                    <span className="position-relative">
                        <Icon
                            name={row.is_hide ? "eye" : "eye slash"}
                            color={row.is_hide ? "red" : null}
                            link={!hide}
                            fitted
                            title={row.is_hide ?  "Отобразить IP" : "Скрыть IP для вывода"}
                            disabled={hide}
                            onClick={() => setHide(true)}
                        />
                        {hide && <div
                            style={{
                                position: "absolute",
                                top: -1,
                                left: -1,
                                right: 0,
                                bottom: 0,
                            }}
                            children={<Loader size="mini" active inline />}
                        />}
                    </span>
                </span>

            </div>
        </Table.Cell>
        <Table.Cell
            textAlign="left"
            onDoubleClick={() => props.comment(row.ip)}
            content={<div>
                <div><small>{row.host}</small></div>
                {Boolean(row.comment) && <div>
                    <small>
                        <Icon
                            name="comment"
                        />
                        {row.comment}
                    </small>
                </div>}
            </div>}
        />
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
                        disabled={loading}
                    />
                </span>

                <a
                    href={`/admin/block/ip?addr=${row.ip}`}
                    onClick={e => {
                        e.preventDefault();
                        props.history.push(`/admin/block/ip?addr=${row.ip}`);
                    }}
                    children={<Icon
                        name="chart bar"
                        color="green"
                        className="button-icon mx-1"
                        title="Статистика по ip-адресу"
                        disabled={loading}
                    />}
                />

                <a
                    href={`/admin/block/views?ip=${row.ip}${props.site ? `&site=${props.site}` : ``}`}
                    onClick={e => {
                        e.preventDefault();
                        props.history.push(`/admin/block/views?ip=${row.ip}${props.site ? `&site=${props.site}` : ``}`);
                    }}
                    children={<Icon
                        name="eye"
                        color="black"
                        className="button-icon mx-1"
                        title="Все просмотры страниц сайтов с ip"
                        disabled={loading}
                    />}
                />

                <span>
                    <Icon.Group
                        title="Добавить или изменить комментарий"
                        onClick={() => props.comment(row.ip)}
                    >
                        <Icon name="comment" className="button-icon mx-1" />
                        <Icon corner name="add" link />
                    </Icon.Group>
                </span>

            </div>
        </Table.Cell>
    </Table.Row>

}

export default TableBodyRow;