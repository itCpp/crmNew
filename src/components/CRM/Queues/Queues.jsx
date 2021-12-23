import React from "react";
import { withRouter } from "react-router-dom";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";

import { Message, Loader, Table, Button, Icon } from "semantic-ui-react";

import "./queues.css";

const Queues = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [queues, setQueues] = React.useState([]);

    const [create, setCreate] = React.useState(null);
    const [drop, setDrop] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('queues/getQueues').then(({ data }) => {
            setQueues(data.queues);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        if (create || drop) {

            axios.post('queues/done', {
                create, drop
            }).then(({ data }) => {
                setQueues(q => {
                    q.forEach((r, i) => {
                        if (r.id === data.queue.id) {
                            q[i] = data.queue;
                        }
                    });
                    return q;
                });

                if (data?.added?.requestId) {
                    axios.toast(null, {
                        type: "success",
                        description: <>Создана заявка <b>#{data.added.requestId}</b></>,
                        time: 3000,
                        icon: "plus",
                    });
                }

            }).catch(e => {
                axios.toast(e);
            }).then(() => {
                create && setCreate(null);
                drop && setDrop(null);
            });

        }

    }, [create, drop])

    return <div className="pb-3 px-2 w-100" id="queues-root">

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Очередь текстовых заявок</h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && queues.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Данных ещё нет</strong>
            </div>}

            {!loading && !error && queues.length > 0 && <Table basic="very" collapsing compact selectable={queues.length > 0}>

                <Table.Header>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell className="py-2">#id</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Дата поступления</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Телефон</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">ФИО и комментарий</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Сайт</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">IP</Table.HeaderCell>
                        <Table.HeaderCell className="py-2" />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {queues.map(row => <Table.Row
                        key={row.id}
                        textAlign="center"
                        disabled={row.done_type ? true : false}
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
                                        onClick={() => props.history.push(`/requests?phone=${row.phone}`)}
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
                        <Table.Cell>
                            <div className="d-flex px-2 align-items-center">
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
                            </div>
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>

            </Table>}

        </div>

    </div>;
}

export default withRouter(Queues);