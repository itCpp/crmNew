import React from "react";
import axios from "./../../../utils/axios-header";

import { Message, Table, Icon, Dimmer } from "semantic-ui-react";

import SourceEdit from "./SourceEdit";
import ResourcesSet from "./ResourcesSet";

function Sources(props) {

    const { loading, setLoading } = props;
    const { sources, setSources } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [select, setSelect] = React.useState(null);
    const [resources, setResources] = React.useState(null);

    const updateSources = source => {

        let list = [...sources];
        list.forEach((row, i) => {
            if (row.id === source.id)
                list[i] = source;
        });
        setSources(list);

    }

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

        {select
            ? <SourceEdit
                sourceId={select}
                setOpen={setSelect}
                updateSources={updateSources}
            />
            : null
        }

        {resources
            ? <ResourcesSet
                sourceId={resources}
                setOpen={setResources}
                updateSources={updateSources}
            />
            : null
        }

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
                                <Table.Cell textAlign="left">
                                    <div>
                                        <Icon
                                            name="tasks"
                                            title="Источник виден в списке источников при создании заявок"
                                            color={source.actual_list === 1 ? "green" : "grey"}
                                        />
                                        <Icon
                                            name="add square"
                                            title="Автоматическое добавление текстовой заявки из очереди"
                                            color={source.auto_done_text_queue === 1 ? "green" : "grey"}
                                        />
                                        <Icon
                                            name="map signs"
                                            title="Отображается в счетчике дополнительной информации"
                                            color={source.show_counter === 1 ? "green" : "grey"}
                                        />
                                    </div>
                                    {source.comment ? <div><small>{source.comment}</small></div> : null}
                                </Table.Cell>
                                <Table.Cell className="cell-icons">
                                    <Icon
                                        name="world"
                                        className="button-icon"
                                        title="Выбор ресурсов"
                                        onClick={() => setResources(source.id)}
                                    />
                                    <Icon
                                        name="edit"
                                        className="button-icon"
                                        title="Настройка источника"
                                        onClick={() => setSelect(source.id)}
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
                content="Создайте первый источник"
            />
        }

    </div>


}

export default Sources;