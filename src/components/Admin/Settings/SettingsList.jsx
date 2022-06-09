import { List, Icon } from "semantic-ui-react";

const SettingsList = props => {

    const { rows, setRows, edit } = props;

    return <div className="admin-content-segment">

        {rows && rows.length === 0 &&
            <div className="text-center my-5 opacity-50"><b>Данных нет</b></div>
        }

        {rows && rows.length > 0 && <List divided relaxed className="list-admin" verticalAlign="middle">

            {rows.map(row => <List.Item key={row.id} className="d-flex align-items-center px-2">

                <List.Content className="flex-grow-1">
                    <List.Header as="b" style={{ fontFamily: "monospace" }}>{row.id}</List.Header>
                    <List.Description>{row.comment}</List.Description>
                </List.Content>

                <List.Content>

                    {(row.type === "boolean" || row.type === "bool") && <Icon
                        name={row.value ? "check square outline" : "square outline"}
                        title={row.value ? "Включено" : "Отключено"}
                        color={row.value ? "green" : "grey"}
                        fitted
                        size="large"
                    />}

                    {/* {["boolean", "bool"].indexOf(row.type) >= 0 && <code>
                        {typeof row.value}({row.value ? "true" : "false"})
                    </code>} */}

                    {["int", "integer", "str", "string"].indexOf(row.type) >= 0 && <code>
                        {typeof row.value}({row.value})
                    </code>}

                </List.Content>

                <List.Content className="ml-3">
                    <Icon
                        name="pencil"
                        link
                        fitted
                        onClick={() => edit(row)}
                    />
                </List.Content>

            </List.Item>)}

        </List>}

    </div>

}

export default SettingsList;