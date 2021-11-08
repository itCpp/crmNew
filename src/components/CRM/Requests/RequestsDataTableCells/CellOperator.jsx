import { Table } from "semantic-ui-react";
import RequestSectorChange from "./Elements/RequestSectorChange";

const CellOperator = props => {

    return <Table.Cell>
        <RequestSectorChange row={props.row} />
    </Table.Cell>

}

export default CellOperator;