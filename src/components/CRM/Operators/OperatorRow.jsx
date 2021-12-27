import React from "react";
import { Table, Label } from "semantic-ui-react";

const OperatorRow = React.memo(props => {

    const { row, columns, online } = props;

    return <Table.Row textAlign="center" positive={online}>
        <Table.Cell className="px-1">
            <span className="mr-1">{row.pin}</span>
            {row.sector && <Label size="tiny" color="blue" style={{ padding: "3px 4px"}}>{row.sector}</Label>}
        </Table.Cell>

        {columns.map(column => <Table.Cell
            key={`${column.name}_${row.pin}`}
            className="px-1"
        >
            <pre className="m-0"
            style={{
                opacity: (row[column.name] || 0) === 0 ? 0.3 : 1,
            }}
            title={column.title}>{row[column.name] || 0}</pre>
        </Table.Cell>)}

    </Table.Row>;

});

export default OperatorRow;