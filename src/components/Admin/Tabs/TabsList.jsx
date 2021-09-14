import { Header, Message, Loader, Table, Icon } from "semantic-ui-react";

function TabsList(props) {

    const { tabs, setEdit } = props;

    if (!tabs.length)
        return <Message info content="Создайте первую вкладку" />

    return <div className="admin-content-segment">

        <Table basic="very" className="mt-3" compact>

            <Table.Header>
                <Table.Row textAlign="center">
                    <Table.HeaderCell>#id</Table.HeaderCell>
                    <Table.HeaderCell title="Наименование вкладки">Вкладка</Table.HeaderCell>
                    <Table.HeaderCell />
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {tabs.map(tab => <Table.Row key={tab.id} textAlign="center" verticalAlign="top">
                    <Table.Cell>{tab.id}</Table.Cell>
                    <Table.Cell>{tab.name}</Table.Cell>
                    <Table.Cell className="cell-icons">
                        <Icon
                            name="edit outline"
                            className="button-icon"
                            title="Настройка статуса"
                            // onClick={() => setEdit(tab.id)}
                        />
                    </Table.Cell>
                </Table.Row>)}
            </Table.Body>

        </Table>

    </div>

}

export default TabsList;