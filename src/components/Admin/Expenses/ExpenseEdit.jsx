import React from "react";
import { Button, Dimmer, Form, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { axios, moment } from "../../../utils";

export const ExpenseEdit = props => {

    const { show, close } = props;
    const [loading, setLoading] = React.useState(false);
    const [loadingError, setLoadingError] = React.useState(null);

    const [formdata, setFormdata] = React.useState({});
    const [accounts, setAccounts] = React.useState([]);
    const [save, setSave] = React.useState(false);
    const [saveError, setSaveError] = React.useState(null);

    const handleChange = React.useCallback((e, { name, value }) => {
        setFormdata(p => ({ ...p, [name]: value }))
    }, []);

    React.useEffect(() => {

        if (show) {

            setLoading(true);

            axios.get('admin/expenses/edit')
                .then(({ data }) => {
                    setAccounts(data.accounts || []);
                    setFormdata({
                        ...(data.row || {}),
                        date: data.row?.date || moment().format("YYYY-MM-DD"),
                    });
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
        }

    }, [show]);

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
                />

                <Form.Input
                    label="Сумма расхода"
                    placeholder="Укажите сумму расхода"
                    type="number"
                    step="0.01"
                    name="sum"
                    value={formdata.sum || ""}
                    onChange={handleChange}
                    disabled={Boolean(loadingError)}
                />

            </Form>

            {(loadingError || saveError) && <Message
                error
                content={loadingError || saveError}
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