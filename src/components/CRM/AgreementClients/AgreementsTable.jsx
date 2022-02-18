import { Button, Checkbox, Icon, Table } from "semantic-ui-react";
import AgreementsTableRow from "./AgreementsTableRow";

const AgreementsTable = props => {

    const { rows } = props;

    return <div className="block-card mb-3 px-2">

        {rows.length === 0 && <div className="my-5 opacity-50 text-center">
            <strong>Данных нет</strong>
        </div>}

        {rows.length > 0 && <div>

            <Table basic="very" selectable style={{ fontSize: "90%" }}>

                <Table.Header fullWidth>
                    <Table.Row>
                        <Table.HeaderCell className="px-2">Договор</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Клиент</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Юристы</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Акт</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Сумма и Расходы</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Комментарии</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Предмет дог.</Table.HeaderCell>
                        <Table.HeaderCell className="px-2">Комментарий колл-цетра</Table.HeaderCell>
                        <Table.HeaderCell className="px-2" />
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {rows.map((row, key) => <AgreementsTableRow
                        key={key}
                        row={row}
                    />)}
                </Table.Body>

                {/* <Table.Footer fullWidth>
                    <Table.Row>
                        <Table.HeaderCell colSpan='5'>
                            <Button
                                floated='right'
                                icon
                                labelPosition='left'
                                primary
                                size='small'
                            >
                                <Icon name='user' /> Add User
                            </Button>
                            <Button size='small'>Approve</Button>
                            <Button disabled size='small'>
                                Approve All
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Footer> */}


            </Table>

        </div>}

    </div>

}

export default AgreementsTable;