import React from "react";
import { Table } from "semantic-ui-react";
import Cell from "./RequestsDataTableCells"

const RequestsDataTableRow = React.memo(props => {

    console.log(props.row.id, "RequestsDataTableRow");

    const { row } = props;

    let className = ["request-row"];
    row.status?.theme && className.push(`request-row-theme-${row.status.theme}`);

    return <Table.Row className={className.join(' ')}>
        <Cell.Id row={row} />
        <Cell.Date row={row} />
    </Table.Row>

});

export default RequestsDataTableRow;