import React from "react";
import { Dimmer, Dropdown, Form, Header, Icon, Loader, Message, Modal } from "semantic-ui-react";
import { axios } from "../../../utils";

const TYPES = [
    { value: "status", text: "Информирование", icon: "announcement", className: "text-info" },
    { value: "error", text: "Ошибка", icon: "remove", className: "text-danger" },
    { value: "success", text: "Успешное", icon: "checkmark", className: "text-success" },
    { value: "warning", text: "Внимание", icon: "warning circle", className: "text-warning" },
];

const MaillerEdit = props => {

    const { open, close, setRows } = props;

    const [formdata, setFormdata] = React.useState({});
    const [formload, setFormload] = React.useState(true);
    const [formerror, setFormerror] = React.useState(null);
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [statuses, setStatuses] = React.useState([]);
    const [variables, setVariables] = React.useState([
        "client_name", "comment", "comment_first", "event_at", "phone", "phone7x", "pin", "region", "theme"
    ]);

    const changeFormData = React.useCallback((e, { value, name, checked }) => {
        if (typeof checked != "undefined")
            value = checked;
        setFormdata(p => ({ ...p, [name]: value }));
    }, []);

    const changeFormDataConfig = React.useCallback((e, { value, name, checked }) => {
        if (typeof checked != "undefined")
            value = checked;
        setFormdata(p => ({ ...p, config: { ...(p?.config || {}), [name]: value } }));
    }, []);

    React.useEffect(() => {

        typeof open == "object" && setFormdata(open);

        open && axios.get(`/admin/mailler/${typeof open == "boolean" ? 'create' : `${open.id}/edit`}`)
            .then(({ data }) => {
                setFormdata(data.data);
                setStatuses(data.statuses);
                setVariables(data.variables);
            })
            .catch(e => {
                setFormerror(axios.getError(e));
            })
            .then(() => {
                setFormload(false);
            });

        return () => {
            setFormdata({});
            setFormload(true);
            setFormerror(null);
            setError(null);
            setErrors({});
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {

            const fetch = typeof open == "object"
                ? axios.put(`/admin/mailler/${open?.id}/update`, formdata)
                : axios.post(`/admin/mailler/create`, formdata);

            fetch
                .then(({ data }) => {

                    setError(null);
                    setErrors({});
                    setRows(p => {

                        console.log(p);

                        let rows = [],
                            update = false;

                        p.forEach(r => {
                            if (r.id === data.data.id) {
                                rows.push(data.data);
                                update = true;
                            } else {
                                rows.push(r);
                            }
                        });

                        if (!update) {
                            rows.unshift(data.data);
                        }

                        return rows;
                    });

                    close();
                })
                .catch(e => {
                    setError(axios.getError(e));
                    setErrors(axios.getErrors(e));
                })
                .then(() => {
                    setSave(false);
                })
        }

    }, [save]);

    return <Modal
        open={Boolean(open)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnDocumentClick={false}
        closeOnEscape={false}
        closeIcon={<Icon
            name="close"
            disabled={save}
            onClick={() => save === false && close()}
        />}
        size="tiny"
        content={<div className="content">

            <Header
                as="h2"
                content={open === true ? "Новый обработчик" : "Изменить обработчик"}
            />

            {formerror && <Message
                error
                content={"Ошибка загрузки данных формы: " + formerror}
                size="mini"
                className="mb-3"
            />}

            <Form error={error ? true : false}>

                <Form.Checkbox
                    label="Включено в работу"
                    name="is_active"
                    checked={formdata?.is_active}
                    onChange={changeFormData}
                    error={Boolean(errors?.is_active)}
                    toggle
                    disabled={Boolean(formerror)}
                />

                <Form.Input
                    label="Наименование"
                    placeholder="Введите наименование обработчика"
                    name="title"
                    value={formdata?.title || ""}
                    onChange={changeFormData}
                    error={Boolean(errors.title)}
                    disabled={Boolean(formerror)}
                />

                <Form.Group widths="equal">

                    <Form.Input
                        label="Адресат"
                        placeholder="Введите адрес получателя"
                        name="destination"
                        value={formdata?.destination || ""}
                        onChange={changeFormData}
                        error={Boolean(errors.destination)}
                        required
                        disabled={Boolean(formerror)}
                    />

                    <Form.Input
                        label="Имя от"
                        placeholder="Укажите от кого сообщение"
                        name="from_name"
                        value={formdata?.config?.from_name || ""}
                        onChange={changeFormDataConfig}
                        error={Boolean(errors.from_name)}
                        disabled={Boolean(formerror)}
                    />

                </Form.Group>

                <Form.Input
                    label="Тема сообщения"
                    placeholder="Укажите тему сообщения"
                    name="subject"
                    value={formdata?.config?.subject || ""}
                    onChange={changeFormDataConfig}
                    error={Boolean(errors?.config?.subject)}
                    className="mb-0"
                    disabled={Boolean(formerror)}
                />

                <div className="mb-3">
                    <small>Если оставить поле пустым, в теме сообщения будет номер телефона в формате <code>7XXXXXXXXXX</code></small>
                </div>

                <Form.TextArea
                    label="Текст сообщения"
                    placeholder="Введите текст сообщения"
                    name="message"
                    value={formdata?.config?.message || ""}
                    onChange={changeFormDataConfig}
                    error={Boolean(errors?.config?.message)}
                    rows={5}
                    className="mb-0"
                    disabled={Boolean(formerror)}
                />

                <div className="mb-3">
                    <small>
                        <span>Доступные переменные:</span>
                        {variables.map(r => <>
                            {' '}<code key={r}>${`{${r}}`}</code>{' '}
                        </>)}
                    </small>
                </div>

                {/* <Message
                    info
                    content={`Доступные переменные: ${variables.map(r => <code key={r}>${`{${r}}`}</code>)}`}
                    size="mini"
                /> */}

                <Form.Checkbox
                    label="Учитывать смену PIN'a оператора"
                    name="change_pin"
                    checked={formdata?.config?.change_pin}
                    onChange={changeFormDataConfig}
                    error={Boolean(errors?.config?.change_pin)}
                    toggle
                    disabled={Boolean(formerror)}
                />

                <div className="field mb-0">
                    <label>PIN операторов</label>
                </div>

                <Dropdown
                    placeholder="Укажите PIN операторов"
                    name="pins"
                    options={(formdata?.config?.pins || []).map((r, key) => ({ key, text: r, value: r }))}
                    value={formdata?.config?.pins || []}
                    onChange={changeFormDataConfig}
                    error={Boolean(errors?.config?.pins)}
                    search
                    selection
                    fluid
                    multiple
                    allowAdditions
                    noResultsMessage="Начните вводить PIN"
                    additionLabel="Добавить PIN "
                    disabled={!Boolean(formdata?.config?.change_pin) || Boolean(formerror)}
                />

                <Form.Checkbox
                    label="Учитывать смену статусов"
                    name="change_status"
                    checked={formdata?.config?.change_status}
                    onChange={changeFormDataConfig}
                    error={Boolean(errors?.config?.change_status)}
                    toggle
                    disabled={Boolean(formerror)}
                />

                <Form.Group widths="equal">

                    <Form.Select
                        label="Старый статус"
                        placeholder="Выберите первичный статус"
                        name="status_from"
                        options={statuses}
                        value={formdata?.config?.status_from || ""}
                        onChange={changeFormDataConfig}
                        error={Boolean(errors?.config?.status_from)}
                        fluid
                        disabled={!Boolean(formdata?.config?.change_status) || Boolean(formerror)}
                    />

                    <Form.Select
                        label="Новый статус"
                        placeholder="Выберите конечный статус"
                        name="status_to"
                        options={statuses}
                        value={formdata?.config?.status_to || ""}
                        onChange={changeFormDataConfig}
                        error={Boolean(errors?.config?.status_to)}
                        fluid
                        disabled={!Boolean(formdata?.config?.change_status) || Boolean(formerror)}
                    />

                </Form.Group>

                <Message info content="Необходимо выбрать статусы по которым будет срабатывать триггер рассылки. Отсутствие какого-либо типа статуса будет считаться любым статусом, т.е. при отсутствии старого статуса триггер будет срабатывать при смене с любого статуса. Если не указывать никакого статуса, триггер сработает при любой смене статуса" size="mini" />

                <Dimmer active={formload || save} inverted>
                    <Loader />
                </Dimmer>

                {error && <Message
                    error
                    content={error}
                    list={Object.entries(errors).map(r => r[1])}
                />}

            </Form>

        </div>}
        actions={[
            {
                key: "cancel",
                content: "Отмена",
                disabled: save,
                onClick: () => close(),
                disabled: formload || save,
            },
            {
                key: "save",
                content: "Сохранить",
                color: "green",
                icon: "save",
                labelPosition: "right",
                disabled: formload || Boolean(formerror) || save,
                onClick: () => setSave(true),
            }
        ]}
    />
}

export default MaillerEdit;