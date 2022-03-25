import { useState, useCallback, useEffect } from "react";
import ButtonHeader from "./ButtonHeader";
import { Form, Message, Modal } from "semantic-ui-react";
import { gen_password } from "../Admin/Users/User";
import { axios } from "../../utils";

const UserCreate = props => {

    const [open, setOpen] = useState(false);
    const [formdata, setFormdata] = useState({});

    const [save, setSave] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorsList, setErrorsList] = useState([]);

    const onChange = useCallback((e, { value, name }) => {
        setFormdata(data => ({ ...data, [name]: value }));
    }, []);

    useEffect(() => {

        if (open) {
            setFormdata({ password: gen_password(8) });
            setSave(false);
            setError(null);
            setErrors({});
        }

    }, [open]);

    useEffect(() => {

        if (save) {

            axios.post('users/save', formdata).then(({ data }) => {
                axios.toast(null, {
                    time: 0,
                    type: "success",
                    icon: "add user",
                    title: "Новая учетная запись",
                    description: <div>{data.user?.name_full} <b>PIN: {data.user?.pin}</b>. {data.user?.callcenter && <span>Колл-центр: <b>{data.user.callcenter}</b></span>}</div>
                });
                setOpen(false);
            }).catch(e => {
                axios.setError(e, setError);
                setErrors(axios.getErrors(e));
            }).then(() => {
                setSave(false);
            });
        }

    }, [save]);

    useEffect(() => {

        let list = [];

        for (let i in errors) {
            errors[i].forEach(e => {
                list.push(e + " ");
            });
        }

        setErrorsList(list);

    }, [errors]);

    return <>
        <ButtonHeader
            icon="user plus"
            className="header-nav-btn"
            title="Создать новую учетную запись оператора"
            onClick={() => setOpen(true)}
        />

        <Modal
            open={open}
            header="Новая учетная запись"
            centered={false}
            content={<div className="content">
                <Form loading={save} error={error ? true : false}>

                    <Form.Group widths="equal">
                        <Form.Input
                            fluid
                            label="Фамилия"
                            placeholder="Введите фамилию"
                            name="surname"
                            required
                            value={formdata.surname || ""}
                            onChange={onChange}
                            error={errors.surname ? true : false}
                        />
                        <Form.Input
                            fluid
                            label="Имя"
                            placeholder="Введите имя"
                            name="name"
                            required
                            value={formdata.name || ""}
                            onChange={onChange}
                            error={errors.name ? true : false}
                        />
                        <Form.Input
                            fluid
                            label="Отчество"
                            placeholder="Введите отчество"
                            name="patronymic"
                            value={formdata.patronymic || ""}
                            onChange={onChange}
                            error={errors.patronymic ? true : false}
                        />
                    </Form.Group>

                    <Form.Group widths="equal">
                        <Form.Input
                            required
                            fluid
                            label="Номер телефона"
                            placeholder="Введите номер в любом виде"
                            name="login"
                            value={formdata.login || ""}
                            onChange={onChange}
                            error={errors.login ? true : false}
                        />
                        <Form.Input
                            required
                            fluid
                            label="Пароль"
                            placeholder="Введите пароль..."
                            name="password"
                            value={formdata.password || ""}
                            onChange={onChange}
                            icon={{
                                name: "undo",
                                link: true,
                                onClick: () => onChange(null, {
                                    name: "password",
                                    value: gen_password(8),
                                })
                            }}
                            error={errors.password ? true : false}
                        />
                    </Form.Group>

                    <Message
                        error
                        header={error}
                        list={errorsList}
                        size="mini"
                    />

                </Form>
            </div>}
            actions={[
                {
                    key: "cansel",
                    content: "Отмена",
                    onClick: () => setOpen(false),
                },
                {
                    key: "save",
                    content: "Создать",
                    icon: "save",
                    labelPosition: "right",
                    onClick: () => setSave(true),
                    color: "green",
                    disabled: save,
                }
            ]}
        />
    </>

}

export default UserCreate;
