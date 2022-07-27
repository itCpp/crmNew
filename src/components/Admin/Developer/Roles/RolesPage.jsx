import React from "react";
import { Button, Header, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../../utils";
import RoleRow from "./RoleRow";
import RoleEdit from "./RoleEdit";
import RoleTabs from "./RoleTabs";
import RoleStatuses from "./RoleStatuses";
import RolePermits from "./RolePermits";
import RoleUsers from "./RoleUsers";
import RoleSources from "./RoleSources";

const RolesPage = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [roles, setRoles] = React.useState([]);

    const [openRole, setOpenRole] = React.useState(false);
    const [openTabs, setOpenTabs] = React.useState(false);
    const [openStatuses, setOpenStatuses] = React.useState(false);
    const [openPermits, setOpenPermits] = React.useState(false);
    const [openUsers, setOpenUsers] = React.useState(false);
    const [openSources, setOpenSources] = React.useState(false);

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

    return <div className="segment-compact">

        {openRole && <RoleEdit
            open={openRole}
            setOpen={setOpenRole}
            roles={roles}
            setRoles={setRoles}
        />}

        {openTabs && <RoleTabs
            open={openTabs}
            setOpen={setOpenTabs}
            roles={roles}
            setRoles={setRoles}
        />}

        {openStatuses && <RoleStatuses
            open={openStatuses}
            setOpen={setOpenStatuses}
            roles={roles}
            setRoles={setRoles}
        />}

        {openPermits && <RolePermits
            open={openPermits}
            setOpen={setOpenPermits}
            roles={roles}
            setRoles={setRoles}
        />}

        {openUsers && <RoleUsers
            open={openUsers}
            setOpen={setOpenUsers}
        />}

        {openSources && <RoleSources
            open={openSources}
            setOpen={setOpenSources}
            roles={roles}
            setRoles={setRoles}
        />}

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Роли пользователей"
                subheader="Управление ролями и их разрешениями"
                className="flex-grow-1"
            />

            {loading && <Loader active inline />}

            {!loading && <div>
                <Button
                    icon="plus"
                    color="green"
                    title="Создать новую роль"
                    onClick={() => setOpenRole(true)}
                    circular
                    basic
                />
            </div>}

        </div>

        {!loading && error && <Message error content={error} />}

        {!loading && !error && <div className="admin-content-segment">

            {roles.map(row => <RoleRow
                key={row.role}
                row={row}
                setOpenRole={setOpenRole}
                setOpenTabs={setOpenTabs}
                setOpenStatuses={setOpenStatuses}
                setOpenPermits={setOpenPermits}
                setOpenUsers={setOpenUsers}
                setOpenSources={setOpenSources}
            />)}

        </div>}

    </div>

}

export default RolesPage;