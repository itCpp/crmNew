import React from "react";

import { Message, Table, Icon } from "semantic-ui-react";

function Sources(props) {

    const { sources, setSources } = props;
    const { select, setSelect } = props;
    const [edit, setEdit] = React.useState(null);

    return <div className="admin-content-segment w-100">

        {sources.length
            ? <Table basic="very" className="mt-3" compact>

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
                            <Table.Cell>{source.resources.length
                                ? source.resources.map(resource => <div key={`${source.id}-${resource.id}`}>
                                    <span>{resource.name}</span>
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
            : <Message
                info
                content="Создайте первый источник"
            />
        }

    </div>


}

export default Sources;