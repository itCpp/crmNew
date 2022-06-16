import React from "react";
import { Dimmer, Icon, Label, Loader, Modal } from "semantic-ui-react"
import { axios, moment } from "../../../utils";
import ExpenseEdit from "./ExpenseEdit";

const ExpenseList = props => {

    const { open, data, close, setRows } = props;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [list, setList] = React.useState([]);
    const [row, setRow] = React.useState([]);

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
        size="tiny"
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

            {!loading && !error && list.length > 0 && list.map(row => <div key={row.id}>
                <div className="d-flex align-items-center px-3 py-2">
                    <strong className="flex-grow-1">#{row.id}</strong>
                    <Label color="blue" size="mini">{row.requests}</Label>
                    <Label color="red" size="mini">{row.sum}{' '}Руб</Label>
                    <small className="ml-2">{moment(row.updated_at).format("DD.MM.YYYY HH:mm")}</small>
                    <span className="ml-2">
                        <Icon
                            name="pencil"
                            fitted
                            link
                            onClick={() => setRow(row)}
                        />
                    </span>
                </div>
            </div>)}

            <Dimmer active={loading} inverted>
                <Loader />
            </Dimmer>

        </Modal.Content>

        <ExpenseEdit
            show={Boolean(row)}
            row={row}
            close={() => setRow(null)}
            setRows={setRows}
        // page={page}
        // limit={limit}
        // total={total}
        />

    </Modal>
}

export default ExpenseList;