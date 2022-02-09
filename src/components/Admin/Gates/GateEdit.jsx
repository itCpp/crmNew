import { useEffect, useState } from "react";
import { Checkbox, Form, Message, Modal, Header, Button } from "semantic-ui-react"
import { axios } from "../../../utils";

const GateEdit = props => {

    const { row, setRows, setShow } = props;

    const [loading, setLoading] = useState(false);
    const [errorLoad, setErrorLoad] = useState(null);

    const cookieSerialize = data => {
        let cookies = [];

        if (typeof data == "object" && Object.keys(data).length > 0) {

            for (let i in data)
                cookies.push({ name: i, value: data[i] });
        }

        if (cookies.length === 0)
            cookies.push({ name: null, value: null });

        return cookies;
    }

    const [formdata, setFormdata] = useState({ ...row });
    const [cookies, setCookies] = useState(cookieSerialize(row.headers?.Cookie));
    const [showPass, setShowPass] = useState(false);

    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {

        if (row?.id) {

            setLoading(true);

            axios.post('dev/gates/get', { id: row.id }).then(({ data }) => {
                setErrorLoad(false);
                setFormdata(formdata => ({ ...formdata, ...data.row }));
                setCookies(cookieSerialize(data.row?.headers?.Cookie));
            }).catch(e => {
                setErrorLoad(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

    }, []);

    useEffect(() => {

        if (save) {

            axios.post('dev/gates/save', { ...formdata, cookies }).then(({ data }) => {
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
        header="Настройки шлюза"
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
                icon: "save",
                labelPosition: "right",
            }
        ]}
        content={<div className="content">

            <Form loading={save || loading} error={(error || errorLoad) ? true : false} className="mb-0">

                <Form.Field>
                    <label>Наименование шлюза</label>
                    <Form.Input
                        placeholder="Укажите наименование шлюза"
                        disabled={(errorLoad) ? true : false}
                        name="name"
                        value={formdata.name || ""}
                        onChange={onChange}
                        error={errors.name ? true : false}
                    />
                </Form.Field>

                <Form.Group>

                    <Form.Field required width={10}>
                        <label>Адрес шлюза</label>
                        <Form.Input
                            placeholder="IP адрес шлюза"
                            disabled={(errorLoad) ? true : false}
                            name="addr"
                            value={formdata.addr || ""}
                            onChange={onChange}
                            error={errors.addr ? true : false}
                        />
                    </Form.Field>

                    <Form.Field width={6} required>
                        <label>Количество каналов</label>
                        <Form.Input
                            placeholder="Например 2"
                            disabled={(errorLoad) ? true : false}
                            type="number"
                            step="1"
                            min="0"
                            name="channels"
                            value={formdata.channels || ""}
                            onChange={onChange}
                            error={errors.channels ? true : false}
                        />
                    </Form.Field>

                </Form.Group>

                <Form.Group widths="equal">

                    <Form.Field required>
                        <label>AMI логин</label>
                        <Form.Input
                            placeholder="Имя пользователя"
                            disabled={(errorLoad) ? true : false}
                            name="ami_user"
                            value={formdata.ami_user || ""}
                            onChange={onChange}
                            error={errors.ami_user ? true : false}
                        />
                    </Form.Field>

                    <Form.Field required>
                        <label>AMI пароль</label>
                        <Form.Input
                            placeholder="Пароль доступа AMI"
                            disabled={(errorLoad) ? true : false}
                            name="ami_pass"
                            value={formdata.ami_pass || ""}
                            onChange={onChange}
                            error={errors.ami_pass ? true : false}
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

                <Checkbox
                    toggle
                    className="mb-3"
                    label="Проверять входящие СМС"
                    checked={formdata.check_incoming_sms === 1}
                    onChange={(e, { checked }) => setFormdata(d => ({ ...d, check_incoming_sms: checked ? 1 : 0 }))}
                />

                <Checkbox
                    toggle
                    label="Может использоваться для отправки СМС"
                    checked={formdata.for_sms === 1}
                    onChange={(e, { checked }) => setFormdata(d => ({ ...d, for_sms: checked ? 1 : 0 }))}
                />

                <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
                    <Header
                        color={errors.cookies ? "red" : null}
                        content="Cookie"
                        subheader={errors.cookies ? errors.cookies.join("; ") : "Заголовки для исходящих запросов"}
                        className="m-0"
                    />
                    <div>
                        <Button
                            color="green"
                            circular
                            icon="plus"
                            basic
                            title="Добавить строку Cookie"
                            size="mini"
                            onClick={() => setCookies(c => [{ name: null, value: null }, ...c])}
                        />
                    </div>
                </div>

                {cookies.map((cookie, key) => <Form.Group widths="equal" className="mb-2" key={`cookie_${key}`}>

                    <Form.Field>
                        {key === 0 && <label>Наименование</label>}
                        <Form.Input
                            placeholder="Укажите наименование"
                            disabled={(errorLoad) ? true : false}
                            name="name"
                            value={cookie.name || ""}
                            onChange={(e, { name, value }) => setCookies(c => {
                                let cookies = [...c];
                                cookies[key][name] = value;
                                return cookies;
                            })}
                        />
                    </Form.Field>

                    <Form.Field>
                        {key === 0 && <label>Значение</label>}
                        <Form.Input
                            placeholder="Укажите значение"
                            disabled={(errorLoad) ? true : false}
                            name="value"
                            value={cookie.value || ""}
                            onChange={(e, { name, value }) => setCookies(c => {
                                let cookies = [...c];
                                cookies[key][name] = value;
                                return cookies;
                            })}
                        />
                    </Form.Field>

                </Form.Group>)}

                <Message error size="tiny" content={errorLoad || error} className="mt-3" />

            </Form>

        </div>}
    />

}

export default GateEdit;