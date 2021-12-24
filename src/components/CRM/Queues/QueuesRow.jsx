import React from "react";
import { Table, Button, Icon, Label } from "semantic-ui-react";
import moment from "moment";

const QueuesRow = props => {

    const { row, history } = props;
    const { drop, setDrop } = props;
    const { create, setCreate } = props;

    return <Table.Row
        textAlign="center"
        verticalAlign="top"
        positive={row.done_type === 1}
        negative={row.done_type === 2}
    >
        <Table.Cell className="px-2">{row.id}</Table.Cell>
        <Table.Cell>{moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")}</Table.Cell>
        <Table.Cell>
            <div className="d-flex align-items-center justify-content-center">
                <span>{row.phone}</span>
                <span>
                    <Icon
                        name="search"
                        className="ml-1"
                        link
                        title="Искать заявки по номеру телефона"
                        onClick={() => history.push(`/requests?phone=${row.phone}`)}
                    />
                </span>
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
            <div>{row.ip}</div>
            {row.hostname && <small>{row.hostname}</small>}
        </Table.Cell>
        <Table.Cell className="px-2 text-center">
            {row.done_type
                ? <Label title={row.doneInfo}>
                    <div className="d-flex">
                        <span>
                            {row.done_type === 1 && <Icon name="check" color="green" />}
                            {row.done_type === 2 && <Icon name="ban" color="red" />}
                        </span>
                        {row.done_pin}
                    </div>
                </Label>
                : <div className="d-flex justify-content-center align-items-center">
                    <Button
                        icon="minus"
                        size="mini"
                        basic
                        circular
                        color="red"
                        title="Отклонить запрос"
                        onClick={() => (create || drop) ? null : setDrop(row.id)}
                        loading={drop === row.id}
                        disabled={create === row.id || drop === row.id || (row.done_type && true)}
                    />
                    <Button
                        icon="plus"
                        size="mini"
                        basic
                        circular
                        color="green"
                        title="Добавить заявку"
                        onClick={() => (create || drop) ? null : setCreate(row.id)}
                        loading={create === row.id}
                        disabled={create === row.id || drop === row.id || (row.done_type && true)}
                    />
                </div>}
        </Table.Cell>
    </Table.Row>

}

export default QueuesRow;