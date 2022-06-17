import React from "react";
import { Dimmer, Icon, Label, Loader, Modal } from "semantic-ui-react"
import { axios, moment } from "../../../utils";
import ExpenseEdit from "./ExpenseEdit";
import { useUpdateRows } from "./useUpdateRows";

const ExpenseList = props => {

    const { open, data, close, setRows } = props;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [list, setList] = React.useState([]);
    const [row, setRow] = React.useState(null);

    React.useEffect(() => {

        if (Boolean(data)) {

            setLoading(true);

            axios.post('admin/expenses/list', data)
                .then(({ data }) => {
                    setList(data.rows);
                }).catch(e => {
                    setError(axios.getError(e));
                }).then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setList([]);
            setLoading(false);
            setError(null);
        }

    }, [data]);

    return <Modal
        open={open}
        centered={false}
        size="mini"
        closeIcon={loading ? null : <Icon name="close" onClick={close} />}
    >

        <Modal.Header>Список расходов</Modal.Header>

        <Modal.Content className="position-relative">

            {loading && <div className="text-center my-3">Загрузка...</div>}
            {!loading && error && <div className="text-center my-3">
                <b className="text-danger">{error}</b>
            </div>}
            {!loading && !error && list.length === 0 && <div className="text-center my-3">
                <span className="opacity-50">Данных нет</span>
            </div>}

            {!loading && !error && list.length > 0 && list.map(row => <ExpenseListRow
                key={row.id}
                row={row}
                setRow={setRow}
                setRows={setRows}
                setList={setList}
            />)}

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </Modal.Content>

        <ExpenseEdit
            show={Boolean(row)}
            row={row}
            close={() => setRow(null)}
            setRows={setRows}
            setList={setList}
        />

    </Modal>
}

const ExpenseListRow = props => {

    const { row, setRow, setList, setRows } = props;
    const deleted = Boolean(row.deleted_at);
    const { setUpdate } = useUpdateRows({ setList, setRows });
    const [loading, setLoading] = React.useState()

    const remove = React.useCallback(id => {

        setLoading(true);

        axios.delete('admin/expenses/delete', {
            params: { id }
        }).then(({ data }) => {
            setUpdate(data);
        }).catch(e => {
            axios.toast(e);
        }).then(() => {
            setLoading(false);
        });

    }, []);

    return <div className="d-flex align-items-center px-3 py-2">

        <strong className="flex-grow-1">
            #{row.id}
        </strong>

        <Label color="blue" size="mini" title="Количество заявок">
            {row.requests}
        </Label>

        <Label color="red" size="mini" title="Сумма затрат">
            {row.sum}{' '}<Icon name="rub" fitted />
        </Label>

        <small className="ml-2" title={`Создано ${moment(row.created_at).format("DD.MM.YYYY HH:mm")}`}>
            {moment(row.updated_at).format("DD.MM.YYYY HH:mm")}
        </small>

        <span className="ml-2">
            <Icon
                name="pencil"
                link={!deleted && !loading}
                onClick={() => setRow(row)}
                disabled={deleted || loading}
            />
            <Icon
                name={deleted ? "redo" : "trash"}
                color={deleted ? "green" : "red"}
                title={deleted ? "Восстановить" : "Удалить"}
                fitted
                link={!loading}
                onClick={() => remove(row.id)}
                disabled={loading}
            />
        </span>

    </div>
}

export default ExpenseList;