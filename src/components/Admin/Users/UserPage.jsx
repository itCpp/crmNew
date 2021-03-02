import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from './../../../utils/axios'
import {
    Form,
    Input,
    Select,
    Segment,
    Button,
    Message,
    Icon
} from 'semantic-ui-react'

function UserPage(props) {

    const [user, setUser] = React.useState({});

    const [groups, setGroups] = React.useState([]);
    const [sectors, setSectors] = React.useState([]);
    const [error, setError] = React.useState(false);

    const [loading, setLoading] = React.useState(true);
    const [save, setSave] = React.useState(false);

    React.useEffect(() => {

        axios.post('admin/getUserData', { id: props.user.id }).then(({ data }) => {

            setUser(data.user);

            let groupOptions = [{ key: 0, value: "", text: "Выберите группу прав" }];
            data.groups.forEach(group => {
                groupOptions.push({
                    key: group.id,
                    value: group.name,
                    text: group.name,
                    onClick: () => setChangeData("rights", group.name),
                });
            });
            setGroups(groupOptions);

            let sectorOptions = [{ key: -1, value: "", text: "Выберите сектор" }];
            for (let key in data.sectors) {
                sectorOptions.push({
                    key,
                    value: Number(key),
                    text: data.sectors[key],
                    onClick: () => setChangeData("call-center", Number(key)),
                });
            }
            setSectors(sectorOptions);

        }).catch(error => {
            setError(axios.getError(error));
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const onChange = e => setChangeData(e.currentTarget.name, e.currentTarget.value);

    const setChangeData = (name, value) => {

        let data = Object.assign({}, user);
        data[name] = value;

        setUser(data);

    }

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('admin/saveUserData', user).then(({ data }) => {
                props.setUser(false);
            }).catch(error => {
                setError(axios.getError(error))
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <div className="text-center mt-4 mx-auto user-content">

        <div className="d-flex align-items-center justify-content-center mt-3">
            <Icon
                name="arrow left"
                title="Назад"
                className="mr-3 for-hover for-hover-opacity"
                size="large"
                onClick={() => {
                    props.setUser(null);
                    props.history.replace(`/users`);
                }}
            />
            <h2 className="my-0">Настройка сотрудника</h2>
        </div>

        <Segment>

            {props.user.fullName ? <h3 className="mb-3">{props.user.fullName}</h3> : null}

            <Form loading={loading}>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>ФИО</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Input
                            placeholder="Полное ФИО..."
                            name="fullName"
                            value={user.fullName || ""}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Логин</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Input
                            placeholder="Введите логин для авторизации"
                            name="username"
                            value={user.username || ""}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Статус</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Select
                            className="w-100"
                            placeholder="Выберите группу с правами"
                            options={[
                                {
                                    key: 0,
                                    value: "Работает",
                                    text: "Работает",
                                    onClick: () => setChangeData("state", "Работает"),
                                },
                                {
                                    key: 1,
                                    value: "Уволен",
                                    text: "Уволен",
                                    onClick: () => setChangeData("state", "Уволен"),
                                },
                            ]}
                            value={user.state || ""}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Группа</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Select
                            className="w-100"
                            placeholder="Выберите группу с правами"
                            options={groups}
                            value={user.rights || ""}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Сектор</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Select
                            className="w-100"
                            placeholder="Выберите сектор"
                            options={sectors}
                            value={user['call-center'] || ""}
                        />
                    </Form.Field>
                </Form.Group>

                <h5>Введите новый пароль, чтобы его изменить</h5>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Пароль</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Input
                            placeholder="Введите новый пароль"
                            name="password"
                            value={""}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Еще раз</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Input
                            placeholder="Повторите новый пароль"
                            name="passretry"
                            value={""}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form.Group>

                <h5>Предпочитаемый SIP аккаунт</h5>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>SIP</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Input
                            placeholder="Логин sip аккаунта"
                            name="sip_login"
                            value={user.sip_login || ""}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form.Group>

                <Form.Group inline>
                    <Form.Field width="4">
                        <label>Пароль</label>
                    </Form.Field>
                    <Form.Field width="12" className="right-field">
                        <Input
                            placeholder="Пароль sip аккаунта"
                            name="sip_pass"
                            value={user.sip_pass || ""}
                            onChange={onChange}
                        />
                    </Form.Field>
                </Form.Group>

            </Form>

        </Segment>

        {error ? <Message negative>{error}</Message> : null}

        <div>

            <Button
                onClick={() => {
                    props.setUser(null);
                    props.history.replace(`/users`);
                }}
            >
                Назад
            </Button>

            <Button
                onClick={() => setSave(true)}
                color="green"
                disabled={loading}
            >
                Сохранить
            </Button>

        </div>

    </div>

}

export default withRouter(UserPage)