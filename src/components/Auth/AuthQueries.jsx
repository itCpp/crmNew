import React from "react";
import axios from "./../../utils/axios-header";

import ButtonHeader from "./../Header/ButtonHeader";

import { Modal, Placeholder, List, Icon, Dimmer, Loader } from "semantic-ui-react";

const authQueryIncoming = (e, change, open, update) => {

    if (!e.cancel) {

        axios.toast(null, {
            description: <span>Сотрудник {e.user.name_full} <b>{e.user.pin}</b></span>,
            type: "info",
            time: 10000,
            title: "Запрос авторизации",
            icon: "user",
        });

    }

    change(e.cancel ? (-1) : 1);

    // if (open && !e.cancel) {
    //     update({ add: e.query });
    // }
    // else if (open && e.cancel) {
    //     update({ drop: e.query });
    // }

}

const AuthQueryRow = props => {

    const { row } = props;

    const [loading, setLoading] = React.useState(null);

    const doneQuery = data => {

        setLoading(true);

        axios.post('users/authComplete', data).then(({ data }) => {

        }).catch(error => {
            setLoading(false);
            axios.toast(error);
        }).then(() => {
            setLoading(false);
        });

    }

    return <List.Item className="position-relative py-2">

        <List.Content>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                    <h3 style={{ margin: "0 .5rem 0 0" }}>{row.user?.pin}</h3>
                    <List.Header>{row.user?.name_full}</List.Header>
                </div>
                <div>
                    <Icon
                        name="dont"
                        className="button-icon text-danger"
                        size="large"
                        title="Отклонить"
                        onClick={() => doneQuery({ drop: row.id })}
                    />
                    <Icon
                        name="check circle"
                        className="button-icon text-success"
                        size="large"
                        title="Подтвердить"
                        style={{ margin: 0 }}
                        onClick={() => doneQuery({ done: row.id })}
                    />
                </div>
            </div>
            <div>{row.user_agent}</div>
            <div className="d-flex justify-content-between align-items-center mt-1">
                <small><Icon name="computer" />{row.ip}</small>
                <small>{row.date}</small>
            </div>
        </List.Content>

        <Dimmer active={loading} inverted>
            <Loader inverted />
        </Dimmer>

    </List.Item>

}

/**
 * Модальное окно просмотра запросов авторизации
 * @param {object} props Переданные свойства
 * @returns 
 */
const AuthQueriesModal = props => {

    const { setOpen } = props;
    const { update, setUpdate } = props;

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);

    const [rows, setRows] = React.useState([]);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {

        if (load) {

            axios.post('users/authQueries', { page }).then(({ data }) => {

                setLoading(false);
                setLoad(false);

                setPage(data.next);
                setRows([...rows, ...data.rows]);

                props.setAuthQueriesCount(data.count);

            }).catch(error => {
                axios.toast(error);
                setOpen(null);
            });

        }

    }, [load]);

    React.useEffect(() => {

        if (update) {

            let list = [];

            if (update.add)
                list = [...rows, update.add];
            else if (update.drop) {
                rows.forEach(row => {
                    if (row.id !== update.drop.id)
                        list.push(row);
                });
            }

            setRows(list);

        }

        return () => setUpdate(null);

    }, [update]);

    return <Modal
        open={true}
        closeIcon
        onClose={() => setOpen(null)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        size="tiny"
    >
        <Modal.Header>Запросы на авторизацию</Modal.Header>

        <Modal.Content className="position-relative">

            {loading
                ? <Placeholder fluid>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>
                : (rows.length
                    ? <List divided verticalAlign="middle">
                        {rows.map(row => <AuthQueryRow
                            key={row.id}
                            {...props}
                            row={row}
                        />)}
                    </List>
                    : <div className="text-center text-muted my-5">Данных нет</div>
                )
            }

        </Modal.Content>

    </Modal>

}

const AuthQueries = props => {

    const { user } = props;
    const [open, setOpen] = React.useState(null);
    const [update, setUpdate] = React.useState(null);

    React.useEffect(() => {

        window.Echo.private(`App.Admin.AuthQueries.${user.callcenter_id || 0}.${user.callcenter_sector_id || 0}`)
            .listen('AuthQuery', e => authQueryIncoming(e, props.changeAuthQueriesCount, open, setUpdate))

        return () => {
            window.Echo.leave(`App.Admin.AuthQueries.${user.callcenter_id || 0}.${user.callcenter_sector_id || 0}`);
        }

    }, []);

    return <>

        <ButtonHeader
            icon="user circle"
            className="header-nav-btn"
            title={"Запрос авторизации"}
            label={props.count > 0 ? props.count : null}
            onClick={() => setOpen(true)}
        />

        {open
            ? <AuthQueriesModal
                {...props}
                setOpen={setOpen}
                update={update}
                setUpdate={setUpdate}
            />
            : null
        }

    </>

}

export default AuthQueries;