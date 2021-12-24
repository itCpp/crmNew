import React from "react";
import { withRouter } from "react-router-dom";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";
import throttle from "lodash/throttle";
import { Message, Loader, Table, Button, Icon } from "semantic-ui-react";

import "./queues.css";

const Queues = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [queues, setQueues] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [load, setLoad] = React.useState(false);
    const [stop, setStop] = React.useState(false);

    const [create, setCreate] = React.useState(null);
    const [drop, setDrop] = React.useState(null);

    const getQueues = (formdata = {}) => {

        setLoad(true);
        setPage(formdata.page || 1);

        axios.post('queues/getQueues', formdata).then(({ data }) => {

            setQueues(prev => formdata.page > 1 ? [...prev, ...data.queues] : data.queues);

            setStop(data.next > data.pages);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    const scroll = React.useCallback(throttle(e => {

        const el = document.getElementById('queues-root');
        if (!el) return;

        let data = {
            offsetHeight: document.documentElement.offsetHeight,
            scrollHeight: document.documentElement.scrollHeight,
            scrollTop: document.documentElement.scrollTop,
        }

        const scrolled = data.scrollTop + data.offsetHeight > data.scrollHeight - 200;

        console.log({ page, loading, load, stop, scrolled });

        if (scrolled && !loading && !load && !stop)
            getQueues({ page: page + 1 });

    }, 500), [page, loading, load, stop]);

    React.useEffect(async () => {

        if (page > 1)
            await setStop(true);

        setLoading(true);
        getQueues({ page: 1 });

        return () => {
            document.removeEventListener('scroll', scroll);
        }

    }, [props.location.key]);

    React.useEffect(() => {

        document.addEventListener('scroll', scroll);

        return () => {
            document.removeEventListener('scroll', scroll);
        }

    }, [page, loading, load, stop]);

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
                        verticalAlign="top"
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

            {(loading || load) && <div><Loader active inline="centered" /></div>}

        </div>

    </div>;
}

export default withRouter(Queues);