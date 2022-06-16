import React from "react";
import { axios, moment } from "../../../utils";
import { Icon, Loader, Message, Table, TableCell } from "semantic-ui-react";

export const ExpensesRows = props => {

    const { loading, setLoading } = props;
    const { rows, setRows } = props;

    const [loadPage, setLoadPage] = React.useState(null);
    const [error, setError] = React.useState(null);

    const getExpenses = React.useCallback((param = {}) => {

        setLoadPage(true);

        axios.post('admin/expenses/get', param).then(({ data }) => {
            setRows(prev => data.page > 1 ? [...prev, ...data.rows] : data.rows);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoadPage(false);
        });

    }, []);

    React.useEffect(() => {

        getExpenses();

        return () => {

        }

    }, []);

    return <>

        {loading && <Loader active inline="centered" />}

        {!loading && error && <div className="d-flex justify-content-center">
            <Message error size="mini" content={error} className="px-3 py-2" />
        </div>}

        {rows.map(row => <ExpensesRowsTable
            key={row.date}
            data={row}
            setRow={props.setRow}
        />)}

        {!loading && !error && rows.length === 0 && <div className="opacity-50 text-center my-3">
            <strong>Данных ещё нет</strong>
        </div>}

    </>
}

export const ExpensesRowsTable = props => {

    const { data, setRow } = props;

    return <Table compact selectable celled>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell className="w-100">{moment(data.date).format("DD.MM.YYYY")}</Table.HeaderCell>
                <Table.HeaderCell>Заявок</Table.HeaderCell>
                <Table.HeaderCell>Сумма</Table.HeaderCell>
                <Table.HeaderCell>
                    <Icon
                        name="plus"
                        link
                        color="green"
                        fitted
                        onClick={() => setRow({ date: data.date })}
                    />
                </Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {data.expenses.map(row => <Table.Row key={row.account_id}>
                <Table.Cell>{row.account_name}</Table.Cell>
                <Table.Cell style={{ minWidth: 150 }}>{row.requests}</Table.Cell>
                <Table.Cell style={{ minWidth: 150 }}>{Number(row.sum).toFixed(2)}</Table.Cell>
                <TableCell />
            </Table.Row>)}
        </Table.Body>

    </Table>

}

export default ExpensesRows;