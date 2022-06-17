import React from "react";
import { sortRowsFromDate } from "./index";

export const useUpdateRows = ({ setList, setRows }) => {

    const [data, setUpdate] = React.useState(null);

    React.useEffect(() => {

        if (Boolean(data)) {

            if (typeof setList == "function" && Boolean(data?.expense)) {
                setList(p => {
                    const rows = [...p];
                    rows.forEach((row, i) => {
                        if (row.id === data.expense.id) {
                            rows[i] = { ...row, ...data.expense };
                        }
                    });
                    return rows;
                });
            }

            if (typeof setRows == "function" && Boolean(data?.row)) {
                setRows(p => {
                    const rows = [...p];
                    let pushDate = true;

                    rows.forEach((row, a) => {
                        let pushRow = true;

                        if (row.date === data.row.date) {
                            pushDate = false;
                            row.expenses.forEach((expense, b) => {
                                if (expense.account_id === data.row.account_id) {
                                    pushRow = false;
                                    rows[a].expenses[b] = { ...expense, ...data.row };
                                }
                            });

                            if (pushRow) rows[a].expenses.unshift(data.row);
                        }
                    });

                    if (pushDate) {
                        rows.push({
                            date: data.row.date,
                            expenses: [data.row],
                        });
                    }

                    return sortRowsFromDate(rows);
                });
            }

        }

    }, [data]);

    return {
        setUpdate
    }

}