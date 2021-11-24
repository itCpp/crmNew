import React from "react";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";

import { Message, Loader, Table, Button } from "semantic-ui-react";

import "./queues.css";

const Queues = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [queues, setQueues] = React.useState([]);

    const [create, setCreate] = React.useState(false);
    const [drop, setDrop] = React.useState(false);
    const [load, setLoad] = React.useState(false);

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

    return <div className="p-3 w-100" id="queues-root">

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}
            {loading && <div><Loader active inline="centered" /></div>}

            {!loading && !error && <Table basic="very" collapsing compact selectable>

                <Table.Header>
                    <Table.Row textAlign="center">
                        <Table.HeaderCell className="py-2">#id</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Дата поступления</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Телефон</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">ФИО</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Комментарий</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">Сайт</Table.HeaderCell>
                        <Table.HeaderCell className="py-2">IP</Table.HeaderCell>
                        <Table.HeaderCell className="py-2" />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {queues.map(row => <Table.Row key={row.id} textAlign="center">
                        <Table.Cell>{row.id}</Table.Cell>
                        <Table.Cell>{moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")}</Table.Cell>
                        <Table.Cell>{row.phone}</Table.Cell>
                        <Table.Cell>{row.name}</Table.Cell>
                        <Table.Cell>{row.comment}</Table.Cell>
                        <Table.Cell>{row.site || row?.request_data?.site}</Table.Cell>
                        <Table.Cell>{row.ip}</Table.Cell>
                        <Table.Cell>
                            <Button
                                icon="plus"
                                size="mini"
                                basic
                                circular
                                color="green"
                                title="Добавить заявку"
                                onClick={() => (create || drop) ? null : setCreate(row.id)}
                                loading={create === row.id}
                                disabled={create === row.id || drop === row.id}
                            />
                            <Button
                                icon="minus"
                                size="mini"
                                basic
                                circular
                                color="red"
                                title="Отклонить очередь"
                                onClick={() => (create || drop) ? null : setDrop(row.id)}
                                loading={drop === row.id}
                                disabled={create === row.id || drop === row.id}
                            />
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>

            </Table>}

        </div>

    </div>;
}

export default Queues;