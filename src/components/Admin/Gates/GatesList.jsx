import { List, Icon } from "semantic-ui-react";

const GatesList = props => {

    const { rows, setEdit } = props;

    return <div className="admin-content-segment">

        <List divided relaxed className="list-admin">

            {rows.map(row => {

                let color = "grey";

                if (row?.connected === true)
                    color = "green";
                else if (row?.connected === false)
                    color = "red";

                return <List.Item key={row.id} className="d-flex align-items-center py-2 px-2">

                    <List.Icon
                        name="signal"
                        color={color}
                        disabled={row?.connected === null}
                    />

                    <List.Content className="flex-grow-1">
                        <List.Header as="b">{row.name || row.addr}</List.Header>
                        {row.name && <List.Description>{row.addr}</List.Description>}
                    </List.Content>

                    <List.Content className="d-flex align-items-center justify-content-center mx-4">
                        <span className="mx-2 d-flex">
                            <Icon
                                name="mobile alternate"
                                title="Количество каналов"
                            />
                            <strong>{row.channels || 0}</strong>
                        </span>
                        <span className="mx-2">
                            <Icon
                                name="mail"
                                title={row.check_incoming_sms === 1 ? "Проверяются входящие СМС" : "Входящие СМС не проверяются"}
                                fitted
                                color={row.check_incoming_sms === 1 ? "yellow" : "grey"}
                                disabled={row.check_incoming_sms !== 1}
                            />
                        </span>
                        <span className="mx-2">
                            <Icon
                                name="send"
                                title={row.for_sms === 1 ? "Используется для отправки СМС" : "Не используется для отправки СМС"}
                                fitted
                                color={row.for_sms === 1 ? "green" : "grey"}
                                disabled={row.for_sms !== 1}
                            />
                        </span>
                    </List.Content>

                    <List.Content>
                        <Icon
                            name="pencil"
                            className="button-icon"
                            title="Редактировать данные"
                            fitted
                            onClick={() => setEdit(row)}
                        />
                    </List.Content>

                </List.Item>
            })}

        </List>

    </div>

}

export default GatesList;