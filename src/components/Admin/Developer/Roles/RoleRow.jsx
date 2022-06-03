import { Icon, Label } from "semantic-ui-react";

const RoleRow = props => {

    const { row } = props;
    const { setOpenRole, setOpenTabs, setOpenStatuses, setOpenPermits, setOpenUsers, setOpenSources } = props;

    return <div className="role-row">

        <div><strong>{row.name}</strong></div>

        <div><code>{row.role}</code></div>

        <div title="Количество пользователей, имеющих роль" className="flex-grow-1 text-right">
            <Label
                content={row.users_count || 0}
                size="tiny"
                color={row.users_count || 0 > 0 ? "blue" : "grey"}
            />
        </div>

        <div className="d-flex align-items-center ml-4">

            <span className="mx-1">
                <Icon
                    name="certificate"
                    fitted
                    link
                    // color="orange"
                    title="Определить доступ к статусам заявок"
                    onClick={() => setOpenStatuses(row.role)}
                />
            </span>

            <span className="mx-1">
                <Icon
                    name="table"
                    fitted
                    link
                    // color="brown"
                    title="Определить доступ к вкладкам заявок"
                    onClick={() => setOpenTabs(row.role)}
                />
            </span>

            <span className="mx-1">
                <Icon
                    name="setting"
                    fitted
                    link
                    // color="blue"
                    title="Установить разрешения для роли"
                    onClick={() => setOpenPermits(row.role)}
                />
            </span>

            <span className="mx-1">
                <Icon
                    name="fork"
                    fitted
                    link
                    // color="blue"
                    title="Настроить доступ роли к источникам"
                    onClick={() => setOpenSources(row.role)}
                />
            </span>

            <span className="mx-1">
                <Icon
                    name="users"
                    fitted
                    link
                    title="Список сотрудников, имеющих роль"
                    onClick={() => setOpenUsers(row.role)}
                />
            </span>

            <span className="mx-1">
                <Icon
                    name="pencil"
                    fitted
                    link
                    title="Редактировать данные роли"
                    onClick={() => setOpenRole(row.role)}
                />
            </span>

        </div>

    </div>

}

export default RoleRow;