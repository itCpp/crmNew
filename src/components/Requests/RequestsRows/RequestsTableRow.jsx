import React from "react";
import { Table, Icon } from "semantic-ui-react";
import Cells from "./Cells";
import RequestPinChange from "./../RequestPinChange";
import RequestSectorChange from "./../RequestSectorChange";

const RequestsTableRow = props => {

    const { row } = props;

    let className = ["request-row"];
    row.query_type_icon = null;

    if (row.query_type === "call")
        row.query_type_icon = <Icon name="call square" title="Звонок" />
    else if (row.query_type === "text")
        row.query_type_icon = <Icon name="comment alternate" title="Тектовая заявка" />

    if (row.status?.theme)
        className.push(`request-row-theme-${row.status.theme}`);

    return <Table.Row className={className.join(' ')}>

        <Cells.CellId row={row} setCell={props.setCell} />
        <Cells.CellDate row={row} setCell={props.setCell} />
        <Cells.CellOperator>
            <RequestSectorChange {...props} />
            <RequestPinChange {...props} />
        </Cells.CellOperator>
        <Cells.CellClient row={row} setCell={props.setCell} />
        <Cells.CellTheme row={row} setCell={props.setCell} />
        <Cells.CellComments row={row} setCell={props.setCell} />
        <Cells.CellButtons row={row} setEdit={props.setEdit} />

    </Table.Row>

}

export default RequestsTableRow;