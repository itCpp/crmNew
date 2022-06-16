import React from "react";
import { Button, Dimmer, Form, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { axios, moment } from "../../../utils";
import { sortRowsFromDate } from "./index";

export const ExpenseEdit = props => {

    const { show, close, row, setRows } = props;
    const { page, total, limit } = props;
    const [loading, setLoading] = React.useState(false);
    const [loadingError, setLoadingError] = React.useState(null);

    const [formdata, setFormdata] = React.useState({});
    const [accounts, setAccounts] = React.useState([]);
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);
    const [saveErrors, setSaveErrors] = React.useState({});
    const [errorList, setErrorList] = React.useState(null);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }))
    }, []);

    React.useEffect(() => {

        if (Boolean(row)) {

            if (typeof row == "object") setFormdata(row);

            setLoading(true);

            axios.get('admin/expenses/edit', {
                params: {
                    id: row.id,
                }
            })
                .then(({ data }) => {
                    setAccounts(data.accounts || []);
                    setFormdata(f => ({
                        ...f,
                        date: f.date || moment().format("YYYY-MM-DD"),
                        ...(data.row || {}),
                    }));
                }).catch(e => {
                    setLoadingError(axios.getError(e));
                }).then(() => {
                    setLoading(false);
                });
        }

        return () => {
            setLoading(false);
            setLoadingError(null);
            setFormdata({});
            setSave(false);
            setSaveError(null);
            setSaveErrors({});
            setErrorList(null);
        }

    }, [row]);

    React.useEffect(() => {

        if (save) {

            axios.put('admin/expenses/save', formdata)
                .then(({ data }) => {

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
                                        rows[a].expenses[b].requests = Number(expense.requests) + Number(data.row.requests);
                                        rows[a].expenses[b].sum = Number(expense.sum) + Number(data.row.sum);
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

                    close();

                }).catch(e => {
                    setSaveError(axios.getError(e));
                    setSave(false);

                    let errors = axios.getErrors(e);
                    let list = [];

                    for (let i in errors) {
                        errors[i].forEach(e => {
                            list.push(e);
                        });
                    }

                    setErrorList(list);
                    setSaveErrors(errors);
                });
        }

    }, [save]);

    return <Modal
        open={show}
        header={"Новый расход"}
        centered={false}
        closeIcon={(loading || save) ? null : <Icon
            name="close"
            onClick={close}
        />}
        size="tiny"
        content={<div className="content position-relative">

            <Form>

                <Form.Dropdown
                    label="Аккаунт расхода"
                    placeholder="Выберите или добавьте аккаунт"
                    options={accounts.map((o, i) => ({ ...o, key: i }))}
                    search
                    selection
                    fluid
                    disabled={Boolean(loadingError)}
                    error={Boolean(saveErrors.account_id)}
                    name="account_id"
                    value={formdata.account_id || null}
                    onChange={handleChange}
                    allowAdditions
                    additionLabel="Добавить аккаунт "
                    onAddItem={(e, { value }) => {
                        setAccounts(p => ([{ text: value, value }, ...p]));
                    }}
                    noResultsMessage="Ничего не найдено"
                />

                <Form.Input
                    label="Дата расхода"
                    type="date"
                    name="date"
                    value={formdata.date || ""}
                    onChange={handleChange}
                    disabled={Boolean(loadingError)}
                    error={Boolean(saveErrors.date)}
                />

                <Form.Group widths="equal">

                    <Form.Input
                        label="Сумма расхода"
                        placeholder="Укажите сумму расхода"
                        type="number"
                        step="0.01"
                        name="sum"
                        value={formdata.sum || ""}
                        onChange={handleChange}
                        disabled={Boolean(loadingError)}
                        error={Boolean(saveErrors.sum)}
                    />

                    <Form.Input
                        label="Количетсво заявок"
                        placeholder="Укажите количетсво заявок"
                        type="number"
                        step="1"
                        name="requests"
                        value={formdata.requests || ""}
                        onChange={handleChange}
                        disabled={Boolean(loadingError)}
                        error={Boolean(saveErrors.requests)}
                    />

                </Form.Group>

            </Form>

            {(loadingError || saveError) && <Message
                error
                size="mini"
                content={loadingError || saveError}
                list={errorList}
                className="mb-0 mt-3 px-3 py-2"
            />}

            <div className="mt-3 text-right">
                <Button
                    icon="save"
                    labelPosition="right"
                    content="Сохранить"
                    color="green"
                    disabled={Boolean(loadingError) || save}
                    fluid
                    onClick={() => setSave(true)}
                    loading={save}
                />
            </div>

            <Dimmer active={loading} inverted><Loader /></Dimmer>

        </div>}
    />
}

export default ExpenseEdit;