import React from 'react';
import axios from './../../../../utils/axios-header';
import { withRouter } from 'react-router-dom';

import { Loader, Table, Header, Button, Checkbox } from 'semantic-ui-react';

import RoleEdit from './RoleEdit';

function Roles(props) {

    const urlParams = new URLSearchParams(props.location.search);

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [roles, setRoles] = React.useState([]);

    const [selected, setSelected] = React.useState(urlParams.get("id") || null);
    const [role, setRole] = React.useState({});
    const [update, setUpdate] = React.useState(true);

    const [loadPermits, setLoadPermits] = React.useState(false);
    const [permits, setPermits] = React.useState([]);
    const [rolePermits, setRolePermits] = React.useState([]);

    const [rolePermission, setRolePermission] = React.useState(false);

    const [openRole, setOpenRole] = React.useState(false);

    React.useEffect(() => {

        axios.post('dev/getAllRoles').then(({ data }) => {
            setError(false);
            setRoles(data.roles);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        if (selected && !loading) {

            props.history.replace(`/admin/roles?id=${selected}`);
            setLoadPermits(true);

            axios.post('dev/getPermits', { role: selected }).then(({ data }) => {
                setError(false);
                setRole(data.role);
                setPermits(data.permissions);
                setRolePermits(data.role_permissions);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoadPermits(false);
            });

        }

    }, [selected, loading]);

    React.useEffect(() => {

        if (rolePermission) {

            axios.post('dev/setRolePermit', {
                role: selected,
                permission: rolePermission,
            }).then(({ data }) => {

                setErrors({ ...errors, [rolePermission]: false });

                let permissions = [...rolePermits],
                    index = permissions.indexOf(data.permission);

                if (data.set && index < 0)
                    permissions.push(data.permission);
                else if (!data.set && index >= 0)
                    permissions.splice(index, 1);

                setRolePermits(permissions);

            }).catch(error => {
                setErrors({ ...errors, [rolePermission]: axios.getError(error) });
            }).then(() => {
                setRolePermission(false);
            });

        }

    }, [rolePermission]);

    const tbody = permits.map((permit, i) => <Table.Row key={i} negative={errors[permit.permission] ? true : false}>
        <Table.Cell><b>{permit.permission}</b></Table.Cell>
        <Table.Cell>{permit.comment}</Table.Cell>
        <Table.Cell textAlign="center">
            <div className="position-relative">
                <Checkbox
                    toggle
                    checked={rolePermits.indexOf(permit.permission) >= 0}
                    name={`permission_${permit.permission}`}
                    style={{ marginTop: "4px" }}
                    onChange={() => setRolePermission(permit.permission)}
                    readOnly={rolePermission ? true : false}
                    disabled={rolePermission === permit.permission ? true : false}
                />
                {rolePermission === permit.permission
                    ? <div className="d-flex justify-content-center align-items-center loading-checkbox">
                        <Loader active inverted size="mini" />
                    </div>
                    : null
                }
            </div>
        </Table.Cell>
    </Table.Row>);

    return <div>

        {openRole
            ? <RoleEdit
                open={openRole}
                setOpen={setOpenRole}
                roles={roles}
                setRoles={setRoles}
                setRole={setRole}
            />
            : null
        }

        <div className="d-flex justify-content-start align-items-center mb-4">

            <Header
                as="h2"
                content="Роли"
                subheader="Создание и настройка ролей сотрудников"
                className="mb-0"
            />

            <Button
                icon="plus"
                style={{ margin: "0 0 0 1rem" }}
                title="Добавить новую роль"
                positive
                onClick={() => setOpenRole(true)}
            />

        </div>


        {loading
            ? <div className="text-center mt-4"><Loader inline active /></div>
            : null
        }

        {error
            ? <div className="text-danger text-center my-3"><strong>{error}</strong></div>
            : null
        }

        <div className="d-flex">

            <div>
                {roles.map(role => <div key={role.role} className="buttons-select">
                    <Button
                        fluid
                        onClick={() => {
                            if (!loadPermits) {
                                setSelected(role.role);
                                setUpdate(true);
                            }
                        }}
                        content={role.name || role.role}
                        active={selected === role.role}
                        label={{
                            basic: true,
                            // color: 'red',
                            pointing: 'left',
                            content: role.users_count,
                            title: "Количество пользователей",
                            as: 'a',
                        }}
                    />
                </div>)}

            </div>

            {selected && !loading
                ? <div className="flex-grow-1">

                    {loadPermits
                        ? <div className="text-center mt-4"><Loader inline active /></div>
                        : <div style={{ marginLeft: "1rem" }}>

                            <Header
                                as="h4"
                                content={role.role}
                                subheader={role.comment}
                            />

                            <Table collapsing>

                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Разрешение</Table.HeaderCell>
                                        <Table.HeaderCell>Описание</Table.HeaderCell>
                                        <Table.HeaderCell textAlign="center">
                                            <Button
                                                icon="edit"
                                                style={{ margin: "0" }}
                                                title="Редактировать роль"
                                                primary
                                                onClick={() => setOpenRole(role.role)}
                                                size="tiny"
                                            />
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>{tbody}</Table.Body>

                            </Table>
                        </div>
                    }

                </div>
                : null
            }

        </div>

    </div>

}

export default withRouter(Roles);