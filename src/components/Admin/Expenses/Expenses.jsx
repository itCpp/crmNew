import React from "react";
import { Button, Header } from "semantic-ui-react";
import AdminContentSegment from "../UI/AdminContentSegment";
import ExpenseEdit from "./ExpenseEdit";
import ExpensesRows from "./ExpensesRows";

export const Expenses = props => {

    const [loading, setLoading] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [row, setRow] = React.useState(null);
    const [page, setPage] = React.useState(1);

    return <div className="segment-compact">

        <ExpenseEdit
            show={Boolean(row)}
            row={row}
            close={() => setRow(null)}
            setRows={setRows}
        />

        <AdminContentSegment className="d-flex align-items-center">

            <Header content="Расходы" className="flex-grow-1" />

            <Button
                icon="plus"
                color="green"
                circular
                basic
                onClick={() => setRow(true)}
            />

        </AdminContentSegment>

        <AdminContentSegment>

            <ExpensesRows
                loading={loading}
                setLoading={setLoading}
                rows={rows}
                setRows={setRows}
                setRow={setRow}
                page={page}
                setPage={setPage}
            />

        </AdminContentSegment>

    </div>
}

export default Expenses;