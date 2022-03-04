import { useEffect, useState } from "react";
import { Checkbox, Form, Header, Message, Modal } from "semantic-ui-react"
import { axios } from "../../../utils";

const DataBaseEdit = props => {

    const { row, setRows, setShow } = props;

    const [loading, setLoading] = useState(false);
    const [errorLoad, setErrorLoad] = useState(null);

    const active = typeof row.active != "undefined" ? row.active : true;
    const [formdata, setFormdata] = useState({ ...row, active });
    const [formdataControll, setFormdataControll] = useState({ ...row, active });
    const [showPass, setShowPass] = useState(false);

    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const [migrate, setMigrate] = useState(false);

    useEffect(() => {

        if (row?.id) {

            setLoading(true);

            axios.post('dev/databases/get', { id: row.id }).then(({ data }) => {
                setErrorLoad(false);
                setFormdata(formdata => ({ ...formdata, ...data.row }));
                setFormdataControll(formdata => ({ ...formdata, ...data.row }));
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

    useEffect(() => {

        if (migrate) {

            axios.post('dev/databases/migrate', formdata).then(({ data }) => {

                axios.toast(data.message, {
                    type: "success",
                    time: 10000,
                });

                setFormdata(formdata => ({
                    ...formdata,
                    migration_update: false,
                    migration_has: true,
                    stats: true,
                }));

                setFormdataControll(formdata => ({
                    ...formdata,
                    migration_update: false,
                    migration_has: true,
                    stats: true,
                }));

            }).catch(e => {
                axios.toast(e);
            }).then(() => {
                setMigrate(false);
            });

        }

    }, [migrate]);

    const onChange = (e, { name, value }) => {
        setFormdata(formdata => ({ ...formdata, [name]: value }));
    }

    const changed = JSON.stringify(formdata) !== JSON.stringify(formdataControll);

    const actions = [
        {
            key: "cansel",
            content: "Отмена",
            onClick: () => setShow(null),
            disabled: save || migrate,
        },
        {
            key: "done",
            content: "Сохранить",
            positive: true,
            onClick: () => setSave(true),
            disabled: save || (errorLoad ? true : false) || loading || !changed || migrate,
        }
    ];

    if (formdata.stats === false && formdata.id) {
        actions.unshift({
            key: "migrate",
            content: "Подключить статистику",
            color: "orange",
            icon: "database",
            labelPosition: "right",
            onClick: () => setMigrate(true),
            disabled: save || (errorLoad ? true : false) || loading || migrate,
            loading: migrate,
        });
    }

    if (formdata.stats !== false && formdata.id && (formdata.migration_update === true || formdata.migration_has === false)) {
        actions.unshift({
            key: "migrate_update",
            content: "Обновить базу статистики",
            color: "blue",
            icon: "database",
            labelPosition: "right",
            onClick: () => setMigrate(true),
            disabled: save || (errorLoad ? true : false) || loading || migrate,
            loading: migrate,
        });
    }

    return <Modal
        header="Настройки базы данных"
        open={row ? true : false}
        closeOnDimmerClick={false}
        centered={false}
        actions={actions}
        content={<div className="content">

            <Form loading={save || loading} error={(error || errorLoad) ? true : false} className="mb-0">

                <Checkbox
                    toggle
                    className="mb-3"
                    label={formdata.active ? "Отключить базу данных для проверки очереди заявок" : "Включить базу данных для проверки очереди заявок"}
                    checked={typeof formdata.active == "undefined" ? true : formdata.active}
                    onChange={(e, { checked }) => setFormdata(d => ({ ...d, active: checked }))}
                />

                <Form.Group widths="equal">

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

                    <Form.Field>
                        <label>Домен сайта</label>
                        <Form.Input
                            placeholder="Укажите домен сайта"
                            disabled={(errorLoad) ? true : false}
                            name="domain"
                            value={formdata.domain || ""}
                            onChange={onChange}
                            error={errors.domain ? true : false}
                        />
                    </Form.Field>

                </Form.Group>

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

                {typeof row.connected != "undefined" && <div className="mt-3">
                    <div className="d-flex justify-content-between">
                        <span>Статус подключения:</span>
                        {row.connected === true && <b className="text-success">Доступна</b>}
                        {row.connected === false && <b className="text-danger">Не доступна</b>}
                        {row.connected === null && <b className="text-muted">Отключена</b>}
                    </div>
                    {row.connected_error && <div className="text-danger"><b>Ошибка БАЗЫ ДАННЫХ</b>: {row.connected_error}</div>}
                </div>}

                {row.stats && <div>
                    <div className="d-flex justify-content-between mt-3">
                        <span>Индивидуальная статистика:</span>
                        {row.stats_visits > 0 && <b className="text-primary">Включена</b>}
                        {row.stats_visits === 0 && <b className="text-warning">Включена и не используется</b>}
                    </div>
                </div>}

                <Message error size="tiny" content={errorLoad || error} className="mt-3" />

            </Form>

            {formdata.stat && !loading && !((error || errorLoad) ? true : false) && formdata.queue_table_has !== true && <Message
                warning
                content={<div>Отсутствует таблица очереди, для фиксации обращений. Чтобы создать таблицу, можно в поле <b>Наименование таблицы очереди</b> указать новое имя, сохранить изменения, затем вернуть имя в стандартное значение. Таким образом будет создана новая таблица очереди</div>}
                icon="warning"
            />}

        </div>}
    />

}

export default DataBaseEdit;