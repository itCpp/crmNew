import React from 'react';
import axios from './../../../utils/axios-header';

import { Modal, Button, Form, Message } from 'semantic-ui-react';

function gen_password(len = 6) {
    var password = "";
    var symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!_+=";
    for (var i = 0; i < len; i++) {
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return password;
}

function User(props) {

    const { user, setUser } = props;

    const [loading, setLoading] = React.useState(true);

    const [loadInput, setLoadInput] = React.useState(false);
    const [errorInput, setErrorInput] = React.useState(false);

    const [gError, setGError] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [save, setSave] = React.useState(false);
    const [formdata, setFormdata] = React.useState({});
    const [pin, setPin] = React.useState(null);

    const [callcenters, setCallcenters] = React.useState([]);
    const [callcenter, setCallcenter] = React.useState({});
    const [sectors, setSectors] = React.useState([]);

    const changeValue = (name, value) => {

        let data = { ...formdata };
        data[name] = value;

        setFormdata(data);

    }

    const changeData = el => {

        let name = el.target.name,
            value = el.target.value;

        changeValue(name, value);

    }

    const setOptionsSectors = data => {

        setSectors(data.map(row => ({
            key: row.id,
            text: row.name,
            value: row.id,
            onClick: () => {
                setCallcenter({ ...callcenter, callcenter_sector_id: row.id });
            },
        })));

    }

    const loadCallCenterData = id => {

        setLoadInput("callcenter_id");

        axios.post('admin/getCallCenterData', { id }).then(({ data }) => {

            setOptionsSectors(data.sectors);
            setPin(data.pin);
            setErrorInput(false);

        }).catch(() => {
            setErrorInput("callcenter_id");
        }).then(() => {
            setLoadInput(false);
        });

    }

    React.useEffect(() => {

        axios.post('admin/getAddUserData').then(({ data }) => {

            setGError(false);

            setCallcenters(data.callcenters.map(row => ({
                key: row.id,
                text: row.name,
                value: row.id,
                onClick: () => {
                    setCallcenter({ ...callcenter, callcenter_id: row.id });
                    loadCallCenterData(row.id);
                },
            })));

            if (data.callcenter) {
                for (let i in data.callcenters) {
                    if (data.callcenters[i].id === data.callcenter) {
                        setOptionsSectors(data.callcenters[i].sectors);
                    }
                }
            }

            setCallcenter({
                callcenter_id: data.callcenter || null,
                callcenter_sector_id: data.callcenter_sector_id || null,
            });

            setFormdata({
                password: gen_password(8),
                auth_type: "secret",
            });

            setPin(data.pin);

        }).catch(error => {
            setGError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('admin/saveUser', {
                ...formdata,
                pin: pin,
                ...callcenter
            }).then(({ data }) => {
                // setUser(null);
            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    // React.useEffect(() => console.log(formdata), [formdata]);

    return <Modal
        centered={false}
        open={user ? true : false}
        onClose={() => setUser(null)}
        onOpen={() => setUser(null)}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
        size="small"
    >
        <Modal.Header>Добавить сотрудника</Modal.Header>

        <Modal.Content>

            <Form loading={loading}>

                <Form.Group widths="equal">
                    <Form.Input
                        fluid
                        label="Фамилия"
                        placeholder="Введите фамилию"
                        name="surname"
                        required
                        value={formdata.surname || ""}
                        onChange={changeData}
                        error={errors.surname || false}
                    />
                    <Form.Input
                        fluid
                        label="Имя"
                        placeholder="Введите имя"
                        name="name"
                        required
                        value={formdata.name || ""}
                        onChange={changeData}
                        error={errors.name || false}
                    />
                    <Form.Input
                        fluid
                        label="Отчество"
                        placeholder="Введите отчество"
                        name="patronymic"
                        value={formdata.patronymic || ""}
                        onChange={changeData}
                        error={errors.patronymic || false}
                    />
                </Form.Group>

                <Form.Group widths="equal">
                    <Form.Select
                        fluid
                        label="Колл-центр"
                        options={callcenters}
                        placeholder="Выберите колл-центр"
                        value={callcenter.callcenter_id}
                        name="callcenter_id"
                        loading={loadInput === "callcenter_id" ? true : false}
                        error={errorInput === "callcenter_id" ? true : false}
                    />
                    <Form.Select
                        fluid
                        label="Сектор"
                        options={sectors}
                        placeholder="Выберите сектор"
                        value={callcenter.callcenter_sector_id}
                        name="callcenter_sector_id"
                        disabled={errorInput === "callcenter_id" ? true : false}
                        error={errors.callcenter_sector_id || false}
                    />
                </Form.Group>

                <Form.Group widths="equal">
                    <Form.Input
                        fluid
                        label="PIN"
                        placeholder="Введите персональный номер"
                        name="pin"
                        required
                        value={pin || ""}
                        onChange={e => setPin(e.target.value)}
                        type="number"
                        error={errors.pin || false}
                    />
                    <Form.Input
                        fluid
                        label="Логин для авторизации"
                        placeholder="Введите логин"
                        name="login"
                        value={formdata.login || ""}
                        onChange={changeData}
                        error={errors.login || false}
                    />
                </Form.Group>

                <Form.Group widths="equal">
                    <Form.Input
                        fluid
                        label="Telegram"
                        placeholder="Идентификатор Telegram"
                        name="telegram_id"
                        value={formdata.telegram_id || ""}
                        onChange={changeData}
                        type="number"
                        error={errors.telegram_id || false}
                    />
                    <Form.Input
                        fluid
                        label="Пароль"
                        placeholder="Введите пароль для входа"
                        name="password"
                        value={formdata.password || ""}
                        onChange={changeData}
                        icon={{
                            name: "undo",
                            link: true,
                            onClick: () => changeValue("password", gen_password(8))
                        }}
                        error={errors.password || false}
                    />
                    <Form.Select
                        fluid
                        label="Способ авторизации"
                        options={[
                            { key: 1, text: "По паролю", value: "secret" },
                        ]}
                        value={formdata.auth_type}
                        name="auth_type"
                        error={errors.auth_type || false}
                    />
                </Form.Group>

            </Form>

        </Modal.Content>

        <Modal.Actions className="d-flex justify-content-between align-items-center">
            <div className="text-danger">
                {gError ? <strong>{gError}</strong> : null}
                {error ? <strong>{error}</strong> : null}
            </div>
            <Button
                onClick={() => setSave(true)}
                content={"Добавить"}
                color="green"
                disabled={loading || gError ? true : false}
            />
        </Modal.Actions>

    </Modal>

}

export default User;