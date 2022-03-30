import React from "react";
import { useSelector } from "react-redux";
import { Header, Icon, Label, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import moment from "moment";

const Online = props => {

    const { onlineId } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {

        setLoading(true);

        axios.get('admin/users/online').then(({ data }) => {
            error && setError(null);
            setRows(data.rows);
        }).catch(e => {
            axios.setError(e, setError);
        }).then(() => {
            setLoading(false);
        });

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

        axios.delete(`admin/users/online/delete/${id}`).then(({ data }) => {

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

            {row.sessions.map((session, i) => <div key={`session_${session.id}`} className="d-flex mt-3">

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

                <div className={`ml-3 ${session.deleted_at ? 'opacity-60' : 'opacity-100'}`}>
                    <small>{session.user_agent}</small>
                </div>

                {session.deleted_at === null && <div className="ml-3 flex-grow-1 text-right">
                    <Icon
                        name="trash"
                        color="red"
                        fitted
                        link={session.loading ? false : true}
                        disabled={session.loading ? true : false}
                        title="Завершить сессию"
                        onClick={() => sessionClose(session.id)}
                    />
                </div>}

            </div>)}

        </div>)}

    </div>
}

export default Online;