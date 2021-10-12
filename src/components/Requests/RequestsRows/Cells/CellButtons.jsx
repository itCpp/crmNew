import { Table, Button, Icon } from "semantic-ui-react";

const CellButtons = props => {

    const { row, setEdit } = props;

    return <Table.Cell>

        <Button.Group size="mini" basic className="request-button-control">
            {row.permits?.requests_edit
                ? <Button
                    icon="edit outline"
                    title="Редактировать заявку"
                    onClick={() => setEdit(row)}
                />
                : null
            }
        </Button.Group>

    </Table.Cell>

}

export default CellButtons;