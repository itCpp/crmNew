import { Table } from "semantic-ui-react";
import RequestChangeSector from "./../RequestEdit/RequestChangeSector";
import RequestChangePin from "./../RequestEdit/RequestChangePin";

const CellOperator = props => {

    return <Table.Cell>
        <RequestChangeSector row={props.row} />
        <RequestChangePin row={props.row} />
    </Table.Cell>

}

export default CellOperator;