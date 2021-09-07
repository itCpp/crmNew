import React from "react";
import axios from "./../../../utils/axios-header";

import { Message, Table, Loader, Dimmer, Icon } from "semantic-ui-react";

function Sources(props) {

    const { loading, setLoading } = props;
    const { resources, setResources } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        setLoad(true);

        axios.post('dev/getResources').then(({ data }) => {
            setResources(data.resources);
            setError(null);
        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    if (loading)
        return null;

    if (load)
        return <div className="text-center my-3"><Loader active inline /></div>

    return <div className="admin-content-segment d-inline-block">

        {error
            ? <Message error content={error} />
            : (resources.length
                ? <div className="position-relative">
                    <Table basic="very" className="mt-3" compact collapsing>

                        <Table.Header>
                            <Table.Row textAlign="center">
                                <Table.HeaderCell>#id</Table.HeaderCell>
                                <Table.HeaderCell title="Тип ресурса">Тип</Table.HeaderCell>
                                <Table.HeaderCell title="Значение ресурса">Ресурс</Table.HeaderCell>
                                <Table.HeaderCell title="Используется в источнике">Источник</Table.HeaderCell>
                                <Table.HeaderCell title="Дата и время создания">Дата</Table.HeaderCell>
                                <Table.HeaderCell title="Количество заявок по ресурсу с момента его создания">Заявок</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {resources.map(resource => {

                                return <Table.Row key={resource.id} textAlign="center" verticalAlign="top">
                                    <Table.Cell><b>{resource.id}</b></Table.Cell>
                                    <Table.Cell><Icon name={resource.icon || false} /></Table.Cell>
                                    <Table.Cell>{resource.val}</Table.Cell>
                                    <Table.Cell>{resource.source ? (resource.source.name || `#${resource.source.id}`) : ""}</Table.Cell>
                                    <Table.Cell>{resource.date}</Table.Cell>
                                    <Table.Cell>{resource.requests || 0}</Table.Cell>
                                </Table.Row>

                            })}
                        </Table.Body>

                    </Table>

                    <Dimmer active={load} inverted />

                </div>
                : <Message
                    info
                    content="Создайте первый ресурс для источника"
                />
            )
        }

    </div>


}

export default Sources;