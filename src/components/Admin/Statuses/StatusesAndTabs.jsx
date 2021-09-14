import React from "react";
import axios from "./../../../utils/axios-header";
import { withRouter } from "react-router";

import { Header, Message, Loader, Table, Icon } from "semantic-ui-react";

import CreateStatus from "./CreateStatus";
import StatusZeronigInfoCell from "./StatusZeronigInfoCell";
import EditStatus from "./EditStatus";

function StatusesAndTabs(props) {

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
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {statuses.map(status => <Table.Row key={status.id} textAlign="center" verticalAlign="top">
                                    <Table.Cell>{status.id}</Table.Cell>
                                    <Table.Cell>{status.name}</Table.Cell>
                                    <Table.Cell>
                                        <StatusZeronigInfoCell
                                            zeroing={status.zeroing}
                                            data={status.zeroing_data}
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

export default withRouter(StatusesAndTabs);
