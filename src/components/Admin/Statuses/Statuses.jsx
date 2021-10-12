import React from "react";
import axios from "./../../../utils/axios-header";
import { withRouter } from "react-router";

import { Header, Message, Loader, Table, Icon, Dropdown } from "semantic-ui-react";

import CreateStatus from "./CreateStatus";
import StatusZeronigInfoCell from "./StatusZeronigInfoCell";
import EditStatus from "./EditStatus";

const SelectTheme = props => {

    const { row, load } = props;

    const options = [
        { text: "Стандартная", value: null },
        { text: "Тема Записи", value: 1 },
        { text: "Тема Слива", value: 2 },
        { text: "Тема Созвона", value: 3 },
        { text: "Тема Брака", value: 4 },
        { text: "Тема Недозвона", value: 5 },
        { text: "Тема БК", value: 6 },
        { text: "Тема Прихода", value: 7 },
        { text: "Тема Онлайн заявки", value: 8 },
        { text: "Тема Онлайн прихода", value: 9 },
        { text: "Тема Онлайн договора", value: 10 },
        { text: "Тема Вторички", value: 11 },
    ];
    return <Dropdown
        placeholder="Оформление"
        selection
        options={options.map((o, i) => ({
            ...o,
            key: i,
            as: () => <div
                className={`request-row-select-item request-row request-row-theme-${o.value} ${o.value === row.theme ? `active` : ``}`}
                onClick={() => props.changeTheme({ id: row.id, theme: o.value })}
            >
                {o.value === row.theme && <Icon name="check" />}
                <span>{o.text}</span>
            </div>,
        }))}
        // onChange={(e, { value }) => props.changeTheme({ id: row.id, theme: value })}
        value={row.theme}
        disabled={load ? true : false}
        loading={load === row.id}
    />
}

function Statuses() {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [statuses, setStatuses] = React.useState([]);

    const [edit, setEdit] = React.useState(null);

    React.useEffect(() => {

        axios.post('dev/getStatuses').then(({ data }) => {
            setStatuses(data.statuses);
            setError(null);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const [loadChangeTheme, setLoadChangeTheme] = React.useState(null);

    const changeTheme = data => {

        setLoadChangeTheme(data.id);

        axios.post('dev/setStatuseTheme', data).then(({ data }) => {
            let list = [...statuses];
            list.forEach((status, i) => {
                if (status.id === data.status.id)
                    list[i] = data.status;
            });
            setStatuses(list);
        }).catch(error => {
            axios.toast(error);
        }).then(() => {
            setLoadChangeTheme(false);
        });

    }

    return <>

        {edit
            ? <EditStatus
                open={edit}
                setOpen={setEdit}
                statuses={statuses}
                setStatuses={setStatuses}
            />
            : null
        }

        <div className="admin-content-segment d-flex justify-content-between align-items-center">

            <Header
                as="h2"
                content="Статусы"
                subheader="Настройка статусов заявок"
            />

            {loading
                ? <Loader active inline />
                : <div>
                    <CreateStatus
                        statuses={statuses}
                        setStatuses={setStatuses}
                    />
                </div>
            }

        </div>

        {error
            ? <Message error content={error} />
            : (!loading
                ? (statuses.length
                    ? <div className="admin-content-segment">

                        <Table basic="very" className="mt-3" compact>

                            <Table.Header>
                                <Table.Row textAlign="center">
                                    <Table.HeaderCell>#id</Table.HeaderCell>
                                    <Table.HeaderCell title="Наименование источника">Статус</Table.HeaderCell>
                                    <Table.HeaderCell title="Информация об обнулении">Обнуление</Table.HeaderCell>
                                    <Table.HeaderCell title="Тема оформления строки заявки">Оформление</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {statuses.map(status => <Table.Row key={status.id} textAlign="center" verticalAlign="middle" className={`request-row ${status.theme ? `request-row-theme-${status.theme}` : ``}`}>
                                    <Table.Cell>{status.id}</Table.Cell>
                                    <Table.Cell>{status.name}</Table.Cell>
                                    <Table.Cell>
                                        <StatusZeronigInfoCell
                                            zeroing={status.zeroing}
                                            data={status.zeroing_data}
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <SelectTheme
                                            row={status}
                                            changeTheme={changeTheme}
                                            load={loadChangeTheme}
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="cell-icons">
                                        <Icon
                                            name="edit outline"
                                            className="button-icon"
                                            title="Настройка статуса"
                                            onClick={() => setEdit(status.id)}
                                        />
                                    </Table.Cell>
                                </Table.Row>)}
                            </Table.Body>

                        </Table>

                    </div>
                    : <Message
                        info
                        content="Создайте первый статус"
                    />
                )
                : null
            )
        }

    </>

}

export default withRouter(Statuses);
