import moment from "moment";
import { Grid, Header, List, Icon } from "semantic-ui-react";

const DataBasesList = props => {

    const { rows, setEdit } = props;

    return <div className="admin-content-segment">

        <List divided relaxed className="list-admin">

            {rows.map(row => {

                let color = "grey";

                if (row?.connected === true)
                    color = "green";
                else if (row?.connected === false)
                    color = "red";

                return <List.Item key={row.id} className="d-flex py-2">

                    <List.Icon
                        name="database"
                        color={color}
                        disabled={row?.connected === null}
                        className="mr-1"
                    />

                    <List.Icon
                        name="area chart"
                        color={row?.stats ? (Number(row?.stats_visits) > 0 ? "blue" : "yellow") : "grey"}
                        disabled={!(row?.stats === true)}
                        title="Индивидуальная статистика"
                    />

                    <List.Content className="flex-grow-1">
                        <List.Header as="b">{row.name || row.host}</List.Header>
                        {row?.connected_error && <List.Description className="text-danger mt-2"><b>Ошибка:</b> {row.connected_error}</List.Description>}
                    </List.Content>

                    <List.Content className="mx-2" style={{ whiteSpace: "nowrap" }}>
                        <small>Добавлена {moment(row.created_at).format("DD.MM.YYYY в HH:mm")}</small>
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

export default DataBasesList;