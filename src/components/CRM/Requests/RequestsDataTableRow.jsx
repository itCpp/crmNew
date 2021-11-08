import React from "react";
import { Table } from "semantic-ui-react";
import Cell from "./RequestsDataTableCells"

const RequestsDataTableRow = React.memo(props => {

    const { row } = props;

    let classList = ["request-row"];
    row.status?.theme && classList.push(`request-row-theme-${row.status.theme}`);

    const [className, setClassName] = React.useState(classList);
    const [firstRender, setFirstRender] = React.useState(true);

    React.useEffect(() => {

        if (firstRender) {
            setFirstRender(false);
        }
        else if (!firstRender) {
            setClassName(list => [...list, 'updateRequestRow']);

            setTimeout(() => {

                setClassName(list => {
                    let classList = [];
                    list.forEach(row => {
                        if (row !== "updateRequestRow" && row !== "createRequestRow")
                            classList.push(row);
                    });
                    return classList;
                });

            }, 200);

        }

    }, [row.updated_at]);

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