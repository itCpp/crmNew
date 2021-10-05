import React from "react";
import axios from "./../../utils/axios-header";

import ButtonHeader from "./../Header/ButtonHeader";

import { Modal, Placeholder, List, Icon, Dimmer, Loader } from "semantic-ui-react";

const opens = {
    modal: false
};

const authQueryIncoming = (e, change, update, setOpen) => {

    if (!e.cancel && !opens.modal) {

        axios.toast(null,
            {
                description: <span>Сотрудник <i>{e.query?.user?.name_full}</i> <b>{e.query?.user?.pin}</b></span>,
                type: "warning",
                time: 10000,
                title: "Запрос авторизации",
                icon: "user",
            },
            () => null,
            () => setOpen(true)
        );

    }

    change(e.cancel ? (-1) : 1);

    if (opens.modal && !e.cancel) {
        update({ add: e.query });
    }
    else if (opens.modal && e.cancel) {
        update({ drop: e.query });
    }

}

const AuthQueryRow = props => {

    const { row, doneQuery, load } = props;

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
                        className={`${load ? 'button-icon-disabled' : 'button-icon'} text-danger`}
                        size="large"
                        title="Отклонить"
                        onClick={() => load ? null : doneQuery({ drop: row.id, id: row.id })}
                    />
                    <Icon
                        name="check circle"
                        className={`${load ? 'button-icon-disabled' : 'button-icon'} text-success`}
                        size="large"
                        title="Подтвердить"
                        style={{ margin: 0 }}
                        onClick={() => load ? null : doneQuery({ done: row.id, id: row.id })}
                    />
                </div>
            </div>
            <div>{row.user_agent}</div>
            <div className="d-flex justify-content-between align-items-center mt-1">
                <small><Icon name="computer" />{row.ip}</small>
                <small>{row.date}</small>
            </div>
        </List.Content>

        <Dimmer active={load === row.id} inverted>
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
    const [loadRow, setLoadRow] = React.useState(false);

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

    const doneQuery = formdata => {

        setLoadRow(formdata.id || true);

        axios.post('users/authComplete', formdata).then(({ data }) => {

            let list = [];
            props.changeAuthQueriesCount(-1);

            rows.forEach(query => {
                if (query.id !== data.id) {
                    list.push(query);
                }
            });

            setRows(list);

        }).catch(error => {
            axios.toast(error);
        }).then(() => {
            setLoadRow(false);
        });

    }

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
                            row={row}
                            load={loadRow}
                            doneQuery={doneQuery}
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
        opens.modal = open;
    }, [open]);

    React.useEffect(() => {

        window.Echo.private(`App.Admin.AuthQueries.${user.callcenter_id || 0}.${user.callcenter_sector_id || 0}`)
            .listen('AuthQuery', e => authQueryIncoming(e, props.changeAuthQueriesCount, setUpdate, setOpen))

        return () => {
            window.Echo.leave(`App.Admin.AuthQueries.${user.callcenter_id || 0}.${user.callcenter_sector_id || 0}`);
        }

    }, []);

    return <>

        <ButtonHeader
            icon="users"
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