import React from "react";
import { Table, Button, Icon, Label, Header } from "semantic-ui-react";
import moment from "moment";
import Flag from "../../Admin/Block/Statistic/IP/FlagIp";

const getIpTitle = data => {
    let title = [];
    if (data?.country_code) title.push(data.country_code);
    if (data?.region_name) title.push(data.region_name);
    if (data?.city) title.push(data.city);
    return title.length > 0 ? title.join(', ') : null;
}

const QueuesRow = props => {

    const { row, history, checkIp, blockIp } = props;
    const { drop, setDrop } = props;
    const { create, setCreate } = props;
    const [className, setClassName] = React.useState([]);

    // React.useEffect(() => {
    //     if (row.updated) {
    //         setTimeout(() => {
    //             setClassName(names => ([...names, "opacity-50"]));
    //         }, 500);
    //     }
    // }, [row.updated]);

    return <Table.Row
        textAlign="center"
        verticalAlign="top"
        positive={row.done_type === 1}
        negative={row.done_type === 2}
        className={className.join(" ")}
    >
        <Table.Cell className="px-2">{row.id}</Table.Cell>
        <Table.Cell className="text-nowrap">{moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")}</Table.Cell>
        <Table.Cell>
            <div className="d-flex align-items-center justify-content-center">
                <span className="text-nowrap">{row.phone}</span>
                {row.show_phone && <span>
                    <Icon
                        name="search"
                        className="ml-1"
                        link
                        title="Искать заявки по номеру телефона"
                        onClick={() => history.push(`/requests?phone=${row.phone}`)}
                    />
                </span>}
            </div>
        </Table.Cell>
        <Table.Cell textAlign="left">
            {row.name && <div>{row.name}</div>}
            {row.comment && <small>{row.comment}</small>}
        </Table.Cell>
        <Table.Cell className="text-nowrap">
            <a href={`//${row.site || row?.request_data?.site}`} target="_blank">{row.site || row?.request_data?.site} <Icon name="external alternate" className="ml-1" /></a>
        </Table.Cell>
        <Table.Cell>
            <div className="d-flex justify-content-center align-items-center" title={getIpTitle(row.ipInfo || {})}>
                {row.ipInfo
                    ? <Flag
                        name={row.ipInfo.country_code}
                    />
                    : <span>
                        <Icon
                            name="question circle outline"
                            title="Проверить IP"
                            onClick={() => checkIp(row.ip, row.id)}
                            link={!row.ipInfoLoading}
                            disabled={row.ipInfoLoading}
                        />
                    </span>
                }
                <Header
                    as="span"
                    color={row.ipBlocked ? "red" : "black"}
                    size="tiny"
                    className="m-0"
                    style={{ fontWeight: 200 }}
                    content={row.ip}
                    disabled={row.ipInfoLoading || row.ipBlockedLoading}
                />
                <span className="ml-2">
                    <Icon
                        name={row.ipBlocked ? "minus square" : "ban"}
                        color={row.ipBlocked ? "red" : "orange"}
                        title={row.ipBlocked ? "Снять блокировку" : "Заблокировать"}
                        fitted
                        onClick={() => blockIp(row.ip, row.id, row.ipBlocked ? false : true)}
                        link={!row.ipBlockedLoading}
                        disabled={row.ipBlockedLoading}
                    />
                </span>
            </div>
            {row.hostname && <small className="text-nowrap">{row.hostname}</small>}
        </Table.Cell>
        <Table.Cell className="px-2 text-center position-relative">

            <div style={{ width: 60 }}>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "absolute",
                    top: 6,
                    right: 0,
                    left: 0,
                }}>

                    <div className="mx-2 d-flex justify-content-center align-items-center">

                        {Boolean(row.done_type) === true && <Label
                            size="tiny"
                            className="px-2"
                            content={<div className="d-flex">
                                <span>
                                    {row.done_type === 1 && <Icon name="check" color="green" />}
                                    {row.done_type === 2 && <Icon name="ban" color="red" />}
                                </span>
                                {row.done_pin}
                            </div>}
                        />}

                        {Boolean(row.done_type) === false && <>

                            <Button
                                icon="minus"
                                size="mini"
                                basic
                                color="red"
                                title="Отклонить запрос"
                                onClick={() => (create || drop) ? null : setDrop(row.id)}
                                loading={drop === row.id}
                                disabled={create === row.id || drop === row.id || (row.done_type && true)}
                                className="mr-1 d-flex align-items-center justify-content-center"
                                style={{ padding: ".5rem .4rem" }}
                            />
                            <Button
                                icon="plus"
                                size="mini"
                                basic
                                color="green"
                                title="Добавить заявку"
                                onClick={() => (create || drop) ? null : setCreate(row.id)}
                                loading={create === row.id}
                                disabled={create === row.id || drop === row.id || (row.done_type && true)}
                                className="mr-0 d-flex align-items-center justify-content-center"
                                style={{ padding: ".5rem .4rem" }}
                            />

                        </>}

                    </div>

                </div>

            </div>

        </Table.Cell>
    </Table.Row>

};

export default QueuesRow;