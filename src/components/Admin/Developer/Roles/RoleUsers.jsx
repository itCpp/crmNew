import React from "react";
import { Dimmer, Icon, Loader, Modal, Table } from "semantic-ui-react";
import { axios } from "../../../../utils";

const RoleUsers = props => {

    const { open, setOpen } = props;

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {

        if (open && open !== true) {

            setLoading(true);

            axios.post('dev/getRole', {
                role: open,
                getUsers: true
            }).then(({ data }) => {
                setUsers(data.users);
                error && setError(null);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [open]);

    return <Modal
        open={open ? true : false}
        header="Пользователи, имеющие роль"
        centered={false}
        closeIcon
        onClose={() => setOpen(false)}
        content={<div className="content position-relative">

            {loading && <div className="my-3 text-center">
                <strong>Загрузка...</strong>
            </div>}

            {!loading && error && <div className="my-3 text-center text-danger">
                <strong>{error}</strong>
            </div>}

            {!loading && !error && <Table collapsing basic="very" compact="very" className="w-100 mb-0" selectable>
                <Table.Body>
                    {users.map(row => <Table.Row key={row.id}>
                        <Table.Cell className="px-1"><b>{row.pin}</b></Table.Cell>
                        <Table.Cell className="px-1" singleLine>
                            <span>{row.name_fio}</span>
                            <span className="ml-2 opacity-60">@{row.login}</span>
                        </Table.Cell>
                        <Table.Cell className="px-1">{(row.roles || []).map(rol => <code key={`${row.id}_role_${rol}`} className="m-1">{rol}</code>)}</Table.Cell>
                        <Table.Cell width={16}>
                            <div className="d-flex justify-content-end align-items-center">

                                {row.superadmin && <span>
                                    <Icon
                                        name="user secret"
                                        color="red"
                                        title="Является супер-пользователем"
                                    />
                                </span>}

                                {row.auth_type == "admin" && <span>
                                    <Icon
                                        name="user circle"
                                        color="green"
                                        title="Авторизация через руководителя"
                                    />
                                </span>}

                                {row.telegram_id && <span>
                                    <Icon
                                        name="telegram plane"
                                        color="blue"
                                        title="Имеется идентификатор Телеграм"
                                    />
                                </span>}

                            </div>
                        </Table.Cell>
                    </Table.Row>)}
                </Table.Body>
            </Table>}

            <Dimmer active={loading} inverted>
                <Loader inline="centered" />
            </Dimmer>

        </div>}
    />

}

export default RoleUsers;
