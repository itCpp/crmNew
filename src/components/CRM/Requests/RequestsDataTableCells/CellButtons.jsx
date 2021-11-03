import { Table, Icon } from "semantic-ui-react";

const CellButtons = props => {

    const { row } = props;

    return <Table.Cell>

        <div className="d-flex justify-content-center align-items-center">
            <Icon
                name="edit"
                title="Редактировать заявку"
                // onClick={() => setEdit(row)}
                className="button-icon mx-1"
            />
        </div>

    </Table.Cell>

}

export default CellButtons;