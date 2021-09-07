import React from "react";
import axios from "./../../../utils/axios-header";

import { Message, Table, Icon, Dimmer } from "semantic-ui-react";

function Sources(props) {

    const { loading, setLoading } = props;
    const { sources, setSources } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {

        setLoad(true);

        axios.post('dev/getSources').then(({ data }) => {
            setSources(data.sources);
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

    return <div className="admin-content-segment w-100">

        {error
            ? <Message error content={error} />
            : null
        }

        {sources.length
            ? <div className="position-relative">
                <Table basic="very" className="mt-3" compact>

                    <Table.Header>
                        <Table.Row textAlign="center">
                            <Table.HeaderCell>#id</Table.HeaderCell>
                            <Table.HeaderCell title="Наименование источника">Источник</Table.HeaderCell>
                            <Table.HeaderCell title="Список ресурсов источника">Ресурсы</Table.HeaderCell>
                            <Table.HeaderCell title="Сектор по умолчанию">Сектор</Table.HeaderCell>
                            <Table.HeaderCell title="количество заявок по источнику">Заявки</Table.HeaderCell>
                            <Table.HeaderCell title="Описание и текущие настройки источника">Описание</Table.HeaderCell>
                            <Table.HeaderCell />
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {sources.map(source => {

                            return <Table.Row key={source.id} textAlign="center" verticalAlign="top">
                                <Table.Cell><b>{source.id}</b></Table.Cell>
                                <Table.Cell>{source.name}</Table.Cell>
                                <Table.Cell>{typeof source.resources === "object" && source.resources.length
                                    ? source.resources.map(resource => <div key={`${source.id}-${resource.id}`} className="d-flex align-items-center justify-content-center">
                                        <span>
                                            <Icon name={resource.type === "phone" ? "phone" : "world"} />
                                        </span>
                                        <span>{resource.val}</span>
                                    </div>)
                                    : <div className="text-muted"><small>Добавте ресурсы</small></div>
                                }</Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                                <Table.Cell></Table.Cell>
                            </Table.Row>

                        })}
                    </Table.Body>

                </Table>

                <Dimmer active={load} inverted />

            </div>
            : <Message
                info
                content="Создайте первый источник"
            />
        }

    </div>


}

export default Sources;