import React from "react";
import { Table } from "semantic-ui-react";
import Cell from "./RequestsDataTableCells"

const RequestsDataTableRow = React.memo(props => {

    const { row } = props;

    let className = ["request-row"];
    row.status?.theme && className.push(`request-row-theme-${row.status.theme}`);

    return <Table.Row className={className.join(' ')} verticalAlign="top">
        <Cell.Id row={row} />
        <Cell.Date row={row} />
        <Cell.Operator row={row} />
        <Cell.Client row={row} />
        <Cell.Theme row={row} />
        <Cell.Comments row={row} />
        <Cell.Buttons row={row} />
    </Table.Row>

});

export default RequestsDataTableRow;