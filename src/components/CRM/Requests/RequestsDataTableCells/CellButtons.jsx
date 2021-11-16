import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { requestEdit } from "../../../../store/requests/actions";
import { Table, Icon } from "semantic-ui-react";

const CellButtons = props => {

    const { row } = props;
    const dispatch = useDispatch();
    const [clicked, setClicked] = useState(null);

    useEffect(() => {
        clicked && setTimeout(() => setClicked(null), 500);
    }, [clicked]);

    return <Table.Cell>

        <div className="d-flex justify-content-center align-items-center">
            <Icon
                name={clicked === "edit" ? "spinner" : "edit"} 
                onClick={() => {
                    dispatch(requestEdit(row));
                    setClicked("edit");
                }}
                title="Редактировать заявку"
                className="button-icon"
                // loading={clicked === "edit"}
            />
        </div>

    </Table.Cell>

}

export default CellButtons;