import React from "react";
import { useSelector } from "react-redux";
import { Header, Icon, Label, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import moment from "moment";
import Cookies from "js-cookie";
import _ from "lodash";

const Online = props => {

    const { onlineId } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    let tokenKey = process.env.REACT_APP_TOKEN_KEY || "token";
    const jwt_token = Cookies.get(tokenKey) || localStorage.getItem(tokenKey);
    let token = null;

    if (typeof jwt_token.split(".")[1] == "string") {

        let json = JSON.parse(new Buffer(jwt_token.split(".")[1], 'base64').toString());

        if (typeof json?.token == "string")
            token = json.token;
    }

    const eventProcess = React.useCallback(({ type, session_id, user_id }) => {

        if (type === "logout") {
            setRows(prev => {
                let rows = [...prev];
                rows.forEach((row, i) => {
                    if (row.id === user_id) {
                        row.sessions.forEach((session, k) => {
                            if (session.id === session_id) {
                                rows[i].sessions[k].deleted_at = new Date;
                            }
                        });
                    }
                });
                return rows;
            });
        } else if (type === "login") {

            axios.get('admin/users/online/get', {
                params: {
                    id: user_id
                }
            }).then(({ data }) => {

                setRows(prev => {

                    let rows = [...prev];
                    let key = rows.find(item => item.id === data.id);

                    if (!key) {
                        rows.unshift(data);
                    } else {

                        rows.forEach((row, i) => {
                            if (row.id === data.id) {
                                data.sessions.forEach((session) => {
                                    if (session.id === session_id) {
                                        rows[i].sessions.unshift(session);
                                    }
                                });
                            }
                        });
                    }

                    return rows;
                });
            });
        }
    }, []);

    React.useEffect(() => {

        setLoading(true);

        window.Echo && window.Echo.private(`App.Admin`)
            .listen('Users\\AuthentificationsEvent', eventProcess);

        axios.get('admin/users/online').then(({ data }) => {
            error && setError(null);
            setRows(data.rows);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

        return () => {
            window.Echo && window.Echo.private(`App.Admin`)
                .stopListening('Users\\AuthentificationsEvent');
        }

    }, []);

    const sessionClose = React.useCallback(id => {

        setRows(prev => {
            let rows = [...prev];
            rows.forEach((row, i) => {
                row.sessions.forEach((session, s) => {
                    if (session.id === id) {
                        rows[i].sessions[s].loading = true;
                    }
                });
            });
            return rows;
        });

        axios.delete(`admin/users/online/delete`, {
            params: {
                id
            }
        }).then(({ data }) => {

            setRows(prev => {
                let rows = [...prev];
                rows.forEach((row, i) => {
                    row.sessions.forEach((session, s) => {
                        if (session.id === id) {
                            rows[i].sessions[s].loading = false;
                            rows[i].sessions[s].deleted_at = new Date;
                        }
                    });
                });
                return rows;
            });

        }).catch(e => {
            axios.toast(e);
        }).then(() => {

            setRows(prev => {
                let rows = [...prev];
                rows.forEach((row, i) => {
                    row.sessions.forEach((session, s) => {
                        if (session.id === id) {
                            rows[i].sessions[s].loading = false;
                        }
                    });
                });
                return rows;
            });

        });

    }, []);

    return <div className="segment-compact">

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                icon={{ name: "computer", disabled: true }}
                as="h2"
                content="Сотрудники в сети"
                subheader="Управление активными сессиями пользователей"
                className="flex-grow-1"
            />

        </div>

        {loading && <Loader active inline="centered" className="mt-4" />}
        {!loading && error && <Message error content={error} />}

        {!loading && typeof rows == "object" && rows.map((row, i) => <div key={`online_user_${i}`} className="admin-content-segment">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <Header
                    as="h4"
                    content={row.name_full}
                    subheader={row.roles.join(', ')}
                    className="flex-grow-1"
                />

                <div className="d-flex align-items-center">

                    {onlineId.indexOf(row.id) >= 0 && <span className="mr-2">
                        <Label empty color="green" circular />
                    </span>}

                    <Header content={row.pin} className="m-0" />

                </div>

            </div>

            {row.sessions.map((session, i) => <div key={`session_${session.id}`} className="d-flex mt-3 align-items-center">

                <div className={`d-flex text-nowrap ${session.deleted_at ? 'opacity-60' : 'opacity-100'}`}>
                    <span>
                        <Icon
                            name="computer"
                            color={session.deleted_at ? "grey" : "green"}
                        />
                    </span>
                    <strong className="mr-2">{session.ip}</strong>
                    <span className="opacity-90">
                        {moment(session.created_at).format("DD.MM.YYYY в HH:mm")}
                    </span>
                </div>

                <div className={`ml-3 ${session.deleted_at ? 'opacity-60' : 'opacity-100'} text-nowrap`} style={{ textOverflow: "ellipsis", overflow: "hidden" }} title={session.user_agent}>
                    <small>{session.user_agent}</small>
                </div>

                <div className="ml-3 flex-grow-1 text-right" style={{ minWidth: "1rem" }}>

                    {(session.deleted_at === null && token !== session.token) && <Icon
                        name="trash"
                        color="red"
                        fitted
                        link={session.loading ? false : true}
                        disabled={session.loading ? true : false}
                        title="Завершить сессию"
                        onClick={() => sessionClose(session.id)}
                    />}

                    {(session.deleted_at !== null && token !== session.token) && <Icon
                        name="ban"
                        color="red"
                        fitted
                        title="Сессия завершена"
                    />}

                    {token === session.token && <Icon
                        name="check"
                        color="green"
                        fitted
                        title="Текущая сессия"
                    />}

                </div>

            </div>)}

        </div>)}

    </div>
}

export default Online;