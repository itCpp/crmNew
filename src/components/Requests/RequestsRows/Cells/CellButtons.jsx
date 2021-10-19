import { Table, Button, Icon } from "semantic-ui-react";

const CellButtons = props => {

    const { row, setEdit } = props;

    return <Table.Cell>

        <div className="d-flex justify-content-center align-items-center">

            <Icon
                name="edit"
                title="Редактировать заявку"
                onClick={() => setEdit(row)}
                className="button-icon mx-1"
            />

            {/* <Icon
                name="ellipsis vertical"
                title="Редактировать заявку"
                onClick={() => setEdit(row)}
                className="button-icon mx-1"
            /> */}

        </div>

        {/* <Button.Group size="mini" className="request-button-control">
            {row.permits?.requests_edit
                ? <Button
                    icon="edit outline"
                    title="Редактировать заявку"
                    onClick={() => setEdit(row)}
                />
                : null
            }
        </Button.Group> */}

    </Table.Cell>

}

export default CellButtons;