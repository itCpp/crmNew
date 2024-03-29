import React from "react";
import axios from "./../../../utils/axios-header";
import { Message, Table, Loader, Dimmer, Icon, Label } from "semantic-ui-react";

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
        return <div className="text-center my-4 segment-compact"><Loader active inline /></div>

    return <div className="admin-content-segment segment-compact">

        <div className="divider-header">
            <h3>Ресурсы источников</h3>
        </div>

        {error
            ? <Message error content={error} />
            : (resources.length
                ? <div className="position-relative">
                    <Table basic="very" className="mt-3 w-100" compact collapsing>

                        <Table.Header>
                            <Table.Row textAlign="center">
                                <Table.HeaderCell>#id</Table.HeaderCell>
                                <Table.HeaderCell title="Тип ресурса">Тип</Table.HeaderCell>
                                <Table.HeaderCell title="Значение ресурса">Ресурс</Table.HeaderCell>
                                <Table.HeaderCell title="Используется в источнике">Источник</Table.HeaderCell>
                                {/* <Table.HeaderCell title="Дата и время создания">Дата</Table.HeaderCell> */}
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
                                    {/* <Table.Cell>{resource.date}</Table.Cell> */}
                                    <Table.Cell>
                                        <span
                                            children={resource.count_requests || 0}
                                            title="Счетчик обращений по ресурсу источника"
                                            style={{
                                                fontFamily: "monospace",
                                                opacity: Number(resource.count_requests) > 0 ? "1" : "0.4"
                                            }}
                                        />
                                    </Table.Cell>
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