import React from "react";
import { withRouter } from "react-router-dom";
import axios from "./../../../utils/axios-header";
import throttle from "lodash/throttle";
import { Message, Loader, Table, Icon, Button, Checkbox } from "semantic-ui-react";
import QueuesRow from "./QueuesRow";
import { getIpInfo, setBlockIp } from "./../../Admin/Block";
import RequestAdd from "./../Requests/RequestsTitle/RequestAdd";
import BtnScrollTop from "../UI/BtnScrollTop/BtnScrollTop.jsx";

import "./queues.css";

const Queues = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [queues, setQueues] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [load, setLoad] = React.useState(false);
    const [stop, setStop] = React.useState(false);

    const [create, setCreate] = React.useState(null);
    const [drop, setDrop] = React.useState(null);

    const [total, setTotal] = React.useState(null);
    const [top, setTop] = React.useState(0);
    const [add, setAdd] = React.useState(false);

    const [showDone, setShowDone] = React.useState(false);

    const getQueues = (formdata = {}) => {

        setLoad(true);
        setPage(formdata.page || 1);

        let last = null,
            first = null;

        if (queues.length && Number(formdata.page || 1) > 1) {
            last = queues[queues.length - 1].id;
            first = queues[0].id;
        }

        axios.post('queues/getQueues', {
            ...formdata,
            first: first,
            last: last,
            done: showDone,
        }).then(({ data }) => {

            setQueues(prev => formdata.page > 1 ? [...prev, ...data.queues] : data.queues);

            setStop(data.next > data.pages);
            setTotal(data.total);
            setError(null);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    const queueUpdateRow = ({ queue }) => {
        setQueues(prev => {
            prev.forEach((row, i) => {
                if (row.id === queue.id) {
                    prev[i] = { ...row, ...queue };
                }
            });
            return [...prev];
        });
    }

    React.useEffect(() => {

        window.Echo && window.Echo.private(`App.Queues`)
            .listen('QueueUpdateRow', queueUpdateRow);

        return () => {
            window.Echo && window.Echo.leave(`App.Queues`);
        }

    }, []);

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
                            q[i] = { ...data.queue, updated: true };
                        }
                    });

                    if (data.append)
                        q.push(data.append);

                    return q;
                });

                // if (data?.added?.requestId) {
                //     axios.toast(null, {
                //         type: "success",
                //         description: <>Создана заявка <b>#{data.added.requestId}</b></>,
                //         time: 3000,
                //         icon: "plus",
                //     });
                // }

            }).catch(e => {
                axios.toast(e);
            }).then(() => {
                create && setCreate(null);
                drop && setDrop(null);
            });

        }

    }, [create, drop])

    const checkIp = async (ip, id) => {

        setQueues(q => {
            q.forEach((r, i) => {
                if (r.id === id) {
                    q[i].ipInfoLoading = true;
                }
            });
            return [...q];
        });

        await getIpInfo(ip, data => {
            setQueues(q => {
                q.forEach((r, i) => {
                    if (r.id === id) {
                        q[i].ipInfoLoading = false;
                    }
                    if (r.ip === data.ip) {
                        q[i].ipInfo = data;
                    }
                });
                return [...q];
            });
        });
    }

    const blockIp = async (ip, id, checked = false) => {

        setQueues(qp => {
            let q = [...qp];
            q.forEach((r, i) => {
                if (r.id === id) {
                    q[i].ipBlockedLoading = true;
                }
            });
            return q;
        });

        await setBlockIp({ ip, checked }, data => {
            setQueues(qp => {
                let q = [...qp];
                q.forEach((r, i) => {
                    if (r.id === id) {
                        q[i].ipBlockedLoading = false;
                    }
                    if (r.ip === data.ip) {
                        q[i].ipBlocked = data.blocked_on;
                    }
                });
                return q;
            });
        }, e => {
            setQueues(qp => {
                let q = [...qp];
                q.forEach((r, i) => {
                    if (r.id === id) {
                        q[i].ipBlockedLoading = false;
                    }
                });
                return q;
            });

            axios.toast(e);
        });
    }

    return <div className="pb-3 px-2 w-100" id="queues-root">

        <div className="d-flex align-items-center">

            <div className="page-title-box">

                <h4 className="page-title d-flex align-items-center">

                    <span>
                        {showDone ? "Завршенные запросы очереди" : "Очередь текстовых заявок"}
                    </span>

                    {/* {total && <span className="mx-2">
                        <Label content={total} color="green" size="tiny" />
                    </span>} */}

                </h4>

            </div>

            <span className="ml-5">
                <Checkbox
                    toggle
                    label={showDone ? "Вывести не обработанные" : "Вывести обработанные"}
                    onClick={() => setShowDone(p => !p)}
                    disabled={loading}
                />
            </span>

            {/* <span className="mx-2">
                <Icon
                    name={showDone ? "check circle" : "circle outline"}
                    color={showDone ? "green" : "black"}
                    fitted
                    link
                    title={showDone ? "Отобразить не обработанные" : "Отобразить обработанные"}
                    size="big"
                    onClick={() => setShowDone(prev => !prev)}
                />
            </span> */}
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
                        <Table.HeaderCell className="p-2">
                            {window?.requestPermits?.requests_add && <>
                                <Button
                                    icon="plus"
                                    color="green"
                                    circular
                                    title="Создать заявку"
                                    basic
                                    onClick={() => setAdd(true)}
                                    size="small"
                                />
                                {add && <RequestAdd setOpen={setAdd} />}
                            </>}
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {queues.map((row, i) => <QueuesRow
                        key={`${i}_${row.id}`}
                        row={row}
                        history={props.history}
                        checkIp={checkIp}
                        blockIp={blockIp}
                        create={create}
                        setCreate={setCreate}
                        drop={drop}
                        setDrop={setDrop}
                    />)}
                </Table.Body>

            </Table>}

            {(loading || load) && <div><Loader active inline="centered" /></div>}

        </div>

        <BtnScrollTop />

    </div>;
}

export default withRouter(Queues);