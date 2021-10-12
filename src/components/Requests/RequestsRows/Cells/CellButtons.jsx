import { Table, Button, Icon } from "semantic-ui-react";

const CellButtons = props => {

    const { row } = props;

    return <Table.Cell>

        {null && <Button.Group size="mini" basic className="request-button-control">
            {row.permits?.requests_edit
                ? <Button
                    icon="edit outline"
                    title="Редактировать заявку"
                    onClick={console.log}
                />
                : null
            }
        </Button.Group>}

    </Table.Cell>

}

export default CellButtons;