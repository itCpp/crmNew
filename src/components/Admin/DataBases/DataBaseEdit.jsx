import { useEffect, useState } from "react";
import { Checkbox, Form, Header, Message, Modal } from "semantic-ui-react"
import { axios } from "../../../utils";

const DataBaseEdit = props => {

    const { row, setRows, setShow } = props;

    const [loading, setLoading] = useState(false);
    const [errorLoad, setErrorLoad] = useState(null);

    const [formdata, setFormdata] = useState({
        ...row,
        active: typeof row.active != "undefined" ? row.active : true,
    });
    const [showPass, setShowPass] = useState(false);

    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {

        if (row?.id) {

            setLoading(true);

            axios.post('dev/databases/get', { id: row.id }).then(({ data }) => {
                setErrorLoad(false);
                setFormdata(formdata => ({ ...formdata, ...data.row }));
            }).catch(e => {
                setErrorLoad(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

    }, []);

    useEffect(() => {

        if (save) {

            axios.post('dev/databases/set', formdata).then(({ data }) => {
                setRows(rows => {
                    let update = false;
                    rows.map((row, i) => {
                        if (row.id === data.row.id) {
                            rows[i] = data.row;
                            update = true;
                        }
                    });
                    if (!update) rows.push(data.row);
                    return rows;
                })
                setShow(null);
            }).catch(e => {
                setSave(false);
                setError(axios.getError(e));
                setErrors(axios.getErrors(e));
            });

        }

    }, [save]);

    const onChange = (e, { name, value }) => {
        setFormdata(formdata => ({ ...formdata, [name]: value }));
    }

    return <Modal
        header="Настройки базы данных"
        open={row ? true : false}
        closeOnDimmerClick={false}
        size="tiny"
        centered={false}
        actions={[
            {
                key: "cansel",
                content: "Отмена",
                onClick: () => setShow(null),
                disabled: save,
            },
            {
                key: "done",
                content: "Сохранить",
                positive: true,
                onClick: () => setSave(true),
                disabled: save || (errorLoad ? true : false) || loading,
            }
        ]}
        content={<div className="content">

            {typeof row.connected != "undefined" && <div>

                <div className="d-flex justify-content-between mb-1">
                    <span>Статус подключения:</span>
                    {row.connected === true && <b className="text-success">Доступна</b>}
                    {row.connected === false && <b className="text-danger">Не доступна</b>}
                    {row.connected === null && <b className="text-muted">Отключена</b>}
                </div>
                {row.connected_error && <div className="text-danger mb-3"><b>Ошибка БАЗЫ ДАННЫХ</b>: {row.connected_error}</div>}

            </div>}

            {row.stats && <div>
                <div className="d-flex justify-content-between mb-1">
                    <span>Индивидуальная статистика:</span>
                    {row.stats_visits && row.stats_visits > 0 && <b className="text-primary">Включена</b>}
                    {row.stats_visits && row.stats_visits === 0 && <b className="text-warning">Включена и не используется</b>}
                </div>          
            </div>}

            {(row.stats || row.connected) && <div className="mb-4"></div>}

            <Form loading={save || loading} error={(error || errorLoad) ? true : false} className="mb-0">

                <Checkbox
                    toggle
                    className="mb-3"
                    label={formdata.active ? "Отключить базу данных" : "Включить базу данных для проверки"}
                    checked={typeof formdata.active == "undefined" ? true : formdata.active}
                    onChange={(e, { checked }) => setFormdata(d => ({ ...d, active: checked }))}
                />

                <Form.Field>
                    <label>Наименование подключения</label>
                    <Form.Input
                        placeholder="Укажите наименование подключения"
                        disabled={(errorLoad) ? true : false}
                        name="name"
                        value={formdata.name || ""}
                        onChange={onChange}
                        error={errors.name ? true : false}
                    />
                </Form.Field>

                <Form.Group>

                    <Form.Field required width={10}>
                        <label>Адрес хоста</label>
                        <Form.Input
                            placeholder="IP адрес сервера"
                            disabled={(errorLoad) ? true : false}
                            name="host"
                            value={formdata.host || ""}
                            onChange={onChange}
                            error={errors.host ? true : false}
                        />
                    </Form.Field>

                    <Form.Field width={6}>
                        <label>Порт</label>
                        <Form.Input
                            placeholder="3306"
                            disabled={(errorLoad) ? true : false}
                            name="port"
                            value={formdata.port || ""}
                            onChange={onChange}
                            error={errors.port ? true : false}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group widths="equal">

                    <Form.Field required>
                        <label>База данных</label>
                        <Form.Input
                            placeholder="Наименование базы данных"
                            disabled={(errorLoad) ? true : false}
                            name="database"
                            value={formdata.database || ""}
                            onChange={onChange}
                            error={errors.database ? true : false}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Наименование таблицы очереди</label>
                        <Form.Input
                            placeholder="Указать, если отличается"
                            disabled={(errorLoad) ? true : false}
                            name="table_name"
                            value={formdata.table_name || ""}
                            onChange={onChange}
                            error={errors.table_name ? true : false}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group widths="equal" className="mb-0">

                    <Form.Field required>
                        <label>Логин</label>
                        <Form.Input
                            placeholder="Имя пользователя"
                            disabled={(errorLoad) ? true : false}
                            name="user"
                            value={formdata.user || ""}
                            onChange={onChange}
                            error={errors.user ? true : false}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>Пароль</label>
                        <Form.Input
                            placeholder="Пароль доступа"
                            disabled={(errorLoad) ? true : false}
                            name="password"
                            value={formdata.password || ""}
                            onChange={onChange}
                            error={errors.password ? true : false}
                            type={showPass ? "text" : "password"}
                            icon={{
                                name: showPass ? "eye slash" : "eye",
                                link: true,
                                onClick: () => setShowPass(show => !show),
                                title: showPass ? "Скрыть пароль" : "Показать пароль"
                            }}
                        />
                    </Form.Field>

                </Form.Group>

                <Message error size="tiny" content={errorLoad || error} className="mt-3" />

            </Form>

        </div>}
    />

}

export default DataBaseEdit;