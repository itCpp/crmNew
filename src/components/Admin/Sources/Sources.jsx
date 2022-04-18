import React from "react";
import axios from "./../../../utils/axios-header";

import { Message, Table, Icon, Dimmer, Header } from "semantic-ui-react";

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

    return <div>

        {select && <SourceEdit
            sourceId={select}
            setOpen={setSelect}
            updateSources={updateSources}
        />}

        {resources && <ResourcesSet
            sourceId={resources}
            setOpen={setResources}
            updateSources={updateSources}
        />}

        {/* <div className="admin-content-segment segment-compact">
            <h2>Источники</h2>
        </div> */}

        {/* <div className="divider-header">
            <h3>Источники</h3>
        </div> */}

        {error && <Message error content={error} />}

        {sources.length === 0 && <Message
            info
            content="Создайте первый источник"
        />}

        {sources.length > 0 && sources.map((row, i) => {
            return <div
                className="admin-content-segment segment-compact mb-2"
                key={`source-${i}-${row.id}`}
            >

                <div className="d-flex justify-content-between align-items-center">

                    <b className="mr-1">#{row.id}</b>
                    <h5 className="m-0 flex-grow-1">
                        {row.name && <span className="mr-1">{row.name}</span>}
                        {row.abbr_name && <span className="opacity-60" title="Сокращенное наименование для вывода в трубке кольщика">{row.abbr_name}</span>}
                    </h5>

                    <div className="d-flex align-items-center">
                        <span>
                            <Icon
                                name="tasks"
                                title="Источник виден в списке источников при создании заявок"
                                color={row.actual_list === 1 ? "green" : "grey"}
                                disabled
                            />
                        </span>
                        <span>
                            <Icon
                                name="add square"
                                title="Автоматическое добавление текстовой заявки из очереди"
                                color={row.auto_done_text_queue === 1 ? "green" : "grey"}
                                disabled
                            />
                        </span>
                        <span>
                            <Icon
                                name="map signs"
                                title="Отображается в счетчике дополнительной информации"
                                color={row.show_counter === 1 ? "green" : "grey"}
                                disabled
                            />
                        </span>

                        <span className="mr-3" />

                        <span>
                            <Icon
                                name="world"
                                className="button-icon"
                                title="Выбор ресурсов"
                                onClick={() => setResources(row.id)}
                                color={(typeof row.resources === "object" && row.resources.length > 0) ? "blue" : "grey"}
                            />
                        </span>
                        <span>
                            <Icon
                                name="pencil"
                                className="button-icon"
                                title="Настройка источника"
                                onClick={() => setSelect(row.id)}
                            />
                        </span>
                    </div>

                </div>

                {(row.comment || (typeof row.resources === "object" && row.resources.length > 0)) && <div className="mt-2">

                    {row.comment && <span className="mr-4">
                        <Icon name="comment" />
                        <span>{row.comment}</span>
                    </span>}

                    {typeof row.resources === "object" && row.resources.map(resource => <span
                        key={`${row.id}-${resource.id}`}
                        className="mr-3"
                        children={<>
                            <Icon
                                name={resource.type === "phone" ? "phone" : "world"}
                                title={resource.type === "phone" ? "Телефон" : "Сайт"}
                                disabled
                            />
                            <span>{resource.val}</span>
                        </>}
                    />)}

                </div>}

            </div>
        })}

    </div>


}

export default Sources;