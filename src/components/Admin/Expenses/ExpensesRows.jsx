import React from "react";
import { axios, moment } from "../../../utils";
import { Icon, Loader, Message, Table, TableCell } from "semantic-ui-react";
import ExpenseList from "./ExpenseList";

export const ExpensesRows = props => {

    const { loading, setLoading } = props;
    const { rows, setRows } = props;
    const { page, setPage, setTotal, setLimit } = props;
    const [loadPage, setLoadPage] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [fullLoad, setFullLoad] = React.useState(false);
    const [list, setList] = React.useState(null);

    const getExpenses = React.useCallback((param = {}) => {

        if (loadPage) return;

        setLoadPage(true);

        axios.post('admin/expenses/get', param).then(({ data }) => {
            setRows(prev => data.page > 1 ? [...prev, ...data.rows] : data.rows);
            setFullLoad(data.nextPage > data.lastPage);
            setPage(data.nextPage);
            setTotal(data.total);
            setLimit(data.limit);
        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoadPage(false);
        });

    }, []);

    React.useEffect(() => {

        getExpenses();

    }, []);

    React.useEffect(() => {

        const scrolling = () => {

            const height = document.getElementById('root').offsetHeight;
            const screenHeight = window.innerHeight;
            const scrolled = window.scrollY;
            const threshold = height - screenHeight / 6;
            const position = scrolled + screenHeight;

            if (threshold >= position || loadPage || fullLoad) return;

            getExpenses({ page });

        }

        window.addEventListener('scroll', scrolling);

        return () => {
            window.removeEventListener('scroll', scrolling);
        }

    }, [loadPage, page, fullLoad]);

    return <>

        <ExpenseList
            open={Boolean(list)}
            data={list}
            close={() => setList(null)}
            setRows={setRows}
        />

        {loading && <Loader active inline="centered" />}

        {!loading && error && <div className="d-flex justify-content-center">
            <Message error size="mini" content={error} className="px-3 py-2" />
        </div>}

        {rows.map(row => <ExpensesRowsTable
            key={row.date}
            data={row}
            setRow={props.setRow}
            setList={setList}
        />)}

        {!loading && !error && rows.length === 0 && <div className="opacity-50 text-center my-3">
            <strong>Данных ещё нет</strong>
        </div>}

        {!loading && loadPage && <Loader
            active
            inline="centered"
            className="mt-1"
            size="mini"
        />}

        {fullLoad && <div className="text-center opacity-50">
            <small>Это все данные</small>
        </div>}

    </>
}

export const ExpensesRowsTable = props => {

    const { data, setRow, setList } = props;

    return <Table compact selectable celled>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell className="w-100">{moment(data.date).format("DD.MM.YYYY")}</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Заявок</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Сумма</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Цена</Table.HeaderCell>
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
                <Table.Cell
                    style={{ minWidth: 130 }}
                    textAlign="center"
                    content={row.requests}
                />
                <Table.Cell
                    style={{ minWidth: 130 }}
                    textAlign="center"
                    content={Number(row.sum).toFixed(2)}
                />
                <Table.Cell
                    style={{ minWidth: 130 }}
                    textAlign="center"
                    content={Number(Number(row.requests) > 0 ? Number(row.sum) / Number(row.requests) : 0).toFixed(2)}
                />
                <TableCell textAlign="center">
                    <Icon
                        name="list"
                        fitted
                        link
                        title="Список расходов аккаунта"
                        onClick={() => setList({ date: row.date, account_id: row.account_id })}
                    />
                </TableCell>
            </Table.Row>)}
        </Table.Body>

    </Table>

}

export default ExpensesRows;