import React from "react";
import { Table } from "semantic-ui-react";
import { useDispatch } from "react-redux";
import { requestEditCell } from "../../../store/requests/actions";
import Cell from "./RequestsDataTableCells"

const RequestsDataTableRow = React.memo(props => {

    const { row } = props;
    const dispatch = useDispatch();

    let classList = ["request-row"];

    const [className, setClassName] = React.useState(classList);
    const [firstRender, setFirstRender] = React.useState(true);
    const [classNameTheme, setClassNameTheme] = React.useState(`request-row-theme-${row.status?.theme || 0}`);

    const setCellEdit = React.useCallback((e, data) => {
        dispatch(requestEditCell({
            id: data.id,
            type: e?.currentTarget?.dataset?.type,
            pageX: e.pageX,
            pageY: e.pageY,
        }));
    }, []);

    React.useEffect(() => {

        if (firstRender) {
            setFirstRender(false);
        }
        else if (!firstRender) {
            setClassName(list => [...list, 'updateRequestRow']);
            setClassNameTheme(`request-row-theme-${row.status?.theme || 0}`);

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

    }, [row]);

    return <Table.Row className={[...className, classNameTheme].join(' ')} verticalAlign="top">
        <Cell.Id row={row} />
        <Cell.Date row={row} setCellEdit={setCellEdit} />
        <Cell.Operator row={row} />
        <Cell.Client row={row} setCellEdit={setCellEdit} />
        <Cell.Theme row={row} setCellEdit={setCellEdit} />
        <Cell.Comments row={row} setCellEdit={setCellEdit} />
        <Cell.Buttons row={row} />
    </Table.Row>

});

export default RequestsDataTableRow;