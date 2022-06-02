import React from "react";
import axios from "./../../../utils/axios-header";
import { Modal, Header, Placeholder, Checkbox, Label, Loader } from "semantic-ui-react";

function Placeholders() {

    return <Placeholder fluid>
        <Placeholder.Header>
            <Placeholder.Line length="full" />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line length="long" />
            <Placeholder.Line length="full" />
        </Placeholder.Header>
    </Placeholder>

}

function User(props) {

    const { user, setOpen } = props;
    const { users, setUsers } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);

    const [loadingKeys, setLoadingKeys] = React.useState([]);
    const [errors, setErrors] = React.useState([]);

    const [roles, setRoles] = React.useState([]);
    const [userRoles, setUserRoles] = React.useState([]);
    const [changeRole, setChangeRole] = React.useState(null);

    const [permits, setPermits] = React.useState([]);
    const [userPermits, setUserPermits] = React.useState([]);
    const [rolesPermits, setRolesPermits] = React.useState([]);
    const [changePermit, setChangePermit] = React.useState(null);
    const [superAdmin, setSuperAdmin] = React.useState(false);

    React.useEffect(() => {

        if (user) {

            axios.post('admin/getRolesAndPermits', {
                id: user.id,
            }).then(({ data }) => {

                setRoles(data.roles);
                setUserRoles(data.user_roles);

                setPermits(data.permits);
                setUserPermits(data.user_permits);
                setRolesPermits(data.roles_permits);
                setSuperAdmin(data.superadmin);

            }).catch(error => {

            }).then(() => {
                setLoading(false);
            });

        }

    }, [user]);

    React.useEffect(() => {

        if (changeRole) {

            let key = `role_${changeRole}`,
                change = [...loadingKeys];

            change.push(key);

            setLoadingKeys(change);

            axios.post('admin/setUserRole', {
                id: user.id,
                role: changeRole,
            }).then(({ data }) => {

                let list = [...errors],
                    index = list.indexOf(key);

                if (index >= 0)
                    list.splice(index, 1);

                setErrors(list);

                let roles = [...userRoles];
                index = roles.indexOf(data.role);

                if (data.checked && index < 0)
                    roles.push(data.role);
                else if (!data.checked && index >= 0)
                    roles.splice(index, 1);

                setUserRoles(roles);

                let usersUpdate = [...users];

                usersUpdate.forEach((row, i) => {
                    if (row.id === user.id)
                        usersUpdate[i].roles = data.roles;
                });

                setUsers(usersUpdate);
                setRolesPermits(data.roles_permits);
                setSuperAdmin(data.superadmin || false);

            }).catch(() => {

                let list = [...errors];
                list.push(key);

                setErrors(list);

            }).then(() => {

                let change = [...loadingKeys],
                    index = change.indexOf(key);

                if (index >= 0)
                    change.splice(index, 1);

                setLoadingKeys(change);

            });

        }

        return () => setChangeRole(null);

    }, [changeRole]);

    React.useEffect(() => {

        if (changePermit) {

            let key = `permit_${changePermit}`,
                change = [...loadingKeys];

            change.push(key);

            setLoadingKeys(change);

            axios.post('admin/setUserPermission', {
                id: user.id,
                permission: changePermit,
                checked: userPermits.indexOf(changePermit) >= 0 ? false : true,
            }).then(({ data }) => {

                let list = [...errors],
                    index = list.indexOf(key);

                if (index >= 0)
                    list.splice(index, 1);

                setErrors(list);

                let permissions = [...userPermits];
                index = permissions.indexOf(data.permission);

                if (data.checked && index < 0)
                    permissions.push(data.permission);
                else if (!data.checked && index >= 0)
                    permissions.splice(index, 1);

                setUserPermits(permissions);

            }).catch(() => {

                let list = [...errors];
                list.push(key);

                setErrors(list);

            }).then(() => {

                let change = [...loadingKeys],
                    index = change.indexOf(key);

                if (index >= 0)
                    change.splice(index, 1);

                setLoadingKeys(change);

            });

        }

        return () => setChangePermit(null);

    }, [changePermit]);

    return <Modal
        centered={false}
        open={user ? true : false}
        onClose={() => setOpen(null)}
        onOpen={() => setOpen(null)}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
        size="small"
    >
        <Modal.Header>{user.name_full} - Роли и права</Modal.Header>

        <Modal.Content>

            <Header
                as="h2"
                content="Роли"
                subheader="Выберите роли для сотрудника"
                dividing
            />

            {loading && <Placeholders />}
            {!loading && roles.length === 0 && <div className="text-center opacity-60 my-5">Ролей не найдено</div>}

            {!loading && roles.length > 0 && <div>
                {roles.map(role => <div key={`role_${role.role}`} className={`d-flex justify-content-between align-items-center row-rights ${errors.indexOf(`role_${role.role}`) >= 0 ? "row-rights-error" : ""}`}>

                    <Header
                        as="h4"
                        content={role.name || role.role}
                        subheader={role.comment}
                        className="mt-0 mb-0"
                        color={errors.indexOf(`role_${role.role}`) >= 0 ? "red" : "black"}
                    />

                    <div className="position-relative">
                        <Checkbox
                            toggle
                            checked={userRoles.indexOf(role.role) >= 0}
                            readOnly={loadingKeys.indexOf(`role_${role.role}`) >= 0}
                            disabled={loadingKeys.indexOf(`role_${role.role}`) >= 0}
                            onChange={() => setChangeRole(role.role)}
                            name={`role_${role.role}`}
                        />
                        {loadingKeys.indexOf(`role_${role.role}`) >= 0 && <div className="d-flex justify-content-center align-items-center loading-checkbox">
                            <Loader inverted size="mini" />
                        </div>}
                    </div>

                </div>)}
            </div>}

            <Header
                as="h2"
                content="Разрешения"
                subheader="Личные разрешения сотрудника, не входящие в роли"
                dividing
            />

            {loading && <Placeholders />}
            {!loading && permits.length === 0 && <div className="text-center opacity-60 my-5">Разрешений не найдено</div>}

            {!loading && permits.length > 0 && <div>
                {permits.map(permit => <div key={`permit_${permit.permission}`} className={`d-flex justify-content-between align-items-center row-rights ${errors.indexOf(`permit_${permit.permission}`) >= 0 ? "row-rights-error" : ""}`}>

                    <Header
                        as="h4"
                        content={permit.permission}
                        subheader={permit.comment}
                        className="mt-0 mb-0 flex-grow-1"
                        color={errors.indexOf(`permit_${permit.permission}`) >= 0 ? "red" : "black"}
                    />

                    {superAdmin && rolesPermits.indexOf(permit.permission) < 0 && <Label
                        circular
                        color="blue"
                        empty
                        className="mx-3"
                        title="Является супер-админом"
                    />}

                    {rolesPermits.indexOf(permit.permission) >= 0 && <Label
                        circular
                        color="green"
                        empty
                        className="mx-3"
                        title="Разрешение имеется в ролях"
                    />}

                    <div className="position-relative">
                        <Checkbox
                            toggle
                            checked={userPermits.indexOf(permit.permission) >= 0}
                            readOnly={loadingKeys.indexOf(`permit_${permit.permission}`) >= 0}
                            disabled={loadingKeys.indexOf(`permit_${permit.permission}`) >= 0}
                            onChange={() => setChangePermit(permit.permission)}
                            name={`permit_${permit.permission}`}
                        />
                        {loadingKeys.indexOf(`permit_${permit.permission}`) >= 0 && <div className="d-flex justify-content-center align-items-center loading-checkbox">
                            <Loader inverted size="mini" />
                        </div>}
                    </div>
                </div>)}
            </div>}

        </Modal.Content>

    </Modal>

}

export default User;