import React from "react";
import { withRouter } from "react-router-dom";
import axios from "./../../../utils/axios-header";
import moment from "./../../../utils/moment";
import throttle from "lodash/throttle";
import { Message, Loader, Table, Icon, Label } from "semantic-ui-react";
import QueuesRow from "./QueuesRow";

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

    const [total, setTotal] = React.useState(null);
    const [top, setTop] = React.useState(0);

    const [showDone, setShowDone] = React.useState(false);

    const getQueues = (formdata = {}) => {

        setLoad(true);
        setPage(formdata.page || 1);

        axios.post('queues/getQueues', {
            ...formdata,
            done: showDone,
        }).then(({ data }) => {

            setQueues(prev => formdata.page > 1 ? [...prev, ...data.queues] : data.queues);

            setStop(data.next > data.pages);
            setTotal(data.total);

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

        if (scrolled && !loading && !load && !stop)
            getQueues({ page: page + 1 });

    }, 500), [page, loading, load, stop]);

    React.useEffect(async () => {

        const header = document.getElementById('header-menu');
        setTop(header?.offsetHeight || 0);

        if (page > 1)
            await setStop(true);

        setLoading(true);
        getQueues({ page: 1 });

        return () => {
            document.removeEventListener('scroll', scroll);
        }

    }, [props.location.key, showDone]);

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
                <h4 className="page-title d-flex align-items-center">
                    <span className="mx-2">
                        <Icon
                            name={showDone ? "check square" : "square outline"}
                            color={showDone ? "green" : "black"}
                            fitted
                            link
                            title={showDone ? "Отобразить не обработанные" : "Отобразить обработанные"}
                            size="large"
                            onClick={() => setShowDone(prev => !prev)}
                        />
                    </span>
                    {showDone
                        ? <span>Завршенные запросы очереди</span>
                        : <span>Очередь текстовых заявок</span>
                    }
                    {/* {total && <span className="mx-2">
                        <Label content={total} color="green" size="tiny" />
                    </span>} */}
                </h4>
            </div>
        </div>

        <div className="block-card mb-3 px-2">

            {!loading && error && <Message error content={error} className="message-center-block" />}

            {!loading && !error && queues.length === 0 && <div className="opacity-50 text-center my-4">
                <strong>Данных ещё нет</strong>
            </div>}

            {!loading && !error && queues.length > 0 && <Table basic="very" collapsing compact selectable={queues.length > 0}>

                <Table.Header style={{ top, zIndex: 100 }} className="position-sticky header-ququeue">
                    <Table.Row textAlign="center">
                        <Table.HeaderCell className="p-2">#id</Table.HeaderCell>
                        <Table.HeaderCell className="p-2">Дата поступления</Table.HeaderCell>
                        <Table.HeaderCell className="p-2">Телефон</Table.HeaderCell>
                        <Table.HeaderCell className="p-2">ФИО и комментарий</Table.HeaderCell>
                        <Table.HeaderCell className="p-2">Сайт</Table.HeaderCell>
                        <Table.HeaderCell className="p-2">IP</Table.HeaderCell>
                        <Table.HeaderCell className="p-2"></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {queues.map(row => <QueuesRow
                        key={row.id}
                        row={row}
                        history={props.history}
                        create={create}
                        setCreate={setCreate}
                        drop={drop}
                        setDrop={setDrop}
                    />)}
                </Table.Body>

            </Table>}

            {(loading || load) && <div><Loader active inline="centered" /></div>}

        </div>

    </div>;
}

export default withRouter(Queues);