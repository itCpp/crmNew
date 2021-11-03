import { Table, Icon } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { requestEdit } from "../../../../store/requests/actions";

const CellButtons = props => {

    const { row } = props;
    const dispatch = useDispatch();

    return <Table.Cell>

        <div className="d-flex justify-content-center align-items-center">
            <Icon
                name="edit"
                title="Редактировать заявку"
                onClick={() => dispatch(requestEdit(row))}
                className="button-icon mx-1"
            />
        </div>

    </Table.Cell>

}

export default CellButtons;