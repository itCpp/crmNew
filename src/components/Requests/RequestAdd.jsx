import _ from "lodash";
import React from "react";
import axios from "./../../utils/axios-header";

import { Modal, Icon, Button, Form, Dropdown } from "semantic-ui-react";

const caseSensitiveSearch = (options, query) => {
    const re = new RegExp(_.escapeRegExp(query))
    return options.filter((opt) => re.test(opt.text))
}

const RequestAdd = props => {

    const { setOpen, permits } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState(false);

    const [cities, setCities] = React.useState([]);
    const [themes, setThemes] = React.useState([]);
    const [sources, setSources] = React.useState([]);

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);

    React.useEffect(() => {

        axios.post('requests/addShow').then(({ data }) => {

            setCities([null, ...data.cities].map((row, i) => ({
                key: i,
                text: row || "Не указан",
                value: row,
            })));

            setThemes([null, ...data.themes].map((row, i) => ({
                key: i,
                text: row || "Не указана",
                value: row,
            })));

            setSources(data.sources.map(row => ({
                key: row.id,
                text: row.name || `Источник №${row.id}`,
                value: row.id,
            })));

        }).catch(error => {
            let message = axios.getError(error);
            setError(message);
            axios.toast(message, { time: 15000 });
        }).then(() => {
            setLoading(false);
        });

    }, []);

    const changeData = (name, value) => {
        setFormdata({ ...formdata, [name]: value });
    }

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('requests/create', formdata).then(({ data }) => {

                axios.toast(null, {
                    time: 5000,
                    type: "success",
                    description: <p>
                        <span>{data.message}</span>
                        <b>{' '}#{data.id}</b>
                    </p>
                });

                setOpen(null);

            }).catch(error => {
                let errors = axios.getErrors(error);
                setErrors(errors);
                axios.toast(error, { time: 5000 });
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        open={true}
        closeIcon
        onClose={() => setOpen(null)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        size="tiny"
    >

        <Modal.Header>
            <Icon name="plus" />
            <span>Новая заявка</span>
        </Modal.Header>

        <Modal.Content className="position-relative">

            <Form loading={loading}>

                <Form.Group>

                    <Form.Select
                        label="Тип заявки"
                        placeholder="Выберите тип заявки"
                        options={[
                            {
                                key: 1,
                                text: "Звонок",
                                value: "call",
                                onClick: () => changeData("query_type", "call")
                            },
                            {
                                key: 2,
                                text: "Текстовая заявка",
                                value: "text",
                                onClick: () => changeData("query_type", "text")
                            },
                        ]}
                        name="query_type"
                        value={formdata.query_type || ""}
                        error={errors.query_type ? true : false}
                        required
                        width={8}
                    />

                    <Form.Input
                        label="Номер телефона"
                        placeholder="Укажите номер телефона"
                        name="phone"
                        value={formdata.phone || ""}
                        onChange={(e, { name, value }) => changeData(name, value)}
                        error={errors.phone ? true : false}
                        required
                        width={8}
                    />

                </Form.Group>

                <Form.Input
                    label="ФИО клиента"
                    placeholder="Укажите ФИО клиента"
                    name="client_name"
                    value={formdata.client_name || ""}
                    onChange={(e, { name, value }) => changeData(name, value)}
                    error={errors.client_name ? true : false}
                />

                <Form.Field required>
                    <label>Источник</label>
                    <Dropdown
                        placeholder="Выберите источник"
                        search={caseSensitiveSearch}
                        selection
                        options={sources}
                        name="source"
                        value={formdata.source || ""}
                        onChange={(e, { name, value }) => changeData(name, value)}
                        error={errors.source ? true : false}
                    />
                </Form.Field>

                <Form.Group>

                    <Form.Field width={8}>
                        <label><Icon name="world" />Город</label>
                        <Dropdown
                            placeholder="Укажите город"
                            search={caseSensitiveSearch}
                            selection
                            options={cities}
                            name="region"
                            value={formdata.region || ""}
                            onChange={(e, { name, value }) => changeData(name, value)}
                            error={errors.region ? true : false}
                        />
                    </Form.Field>

                    <Form.Field width={8}>
                        <label><Icon name="book" />Тематика</label>
                        <Dropdown
                            placeholder="Укажите тематику"
                            search={caseSensitiveSearch}
                            selection
                            options={themes}
                            name="theme"
                            value={formdata.theme || ""}
                            onChange={(e, { name, value }) => changeData(name, value)}
                            error={errors.theme ? true : false}
                        />
                    </Form.Field>

                </Form.Group>

                {permits.requests_comment_first
                    ? <Form.Field>
                        <label><Icon name="comment alternate outline" />Первичный комментарий</label>
                        <Form.TextArea
                            placeholder="Короткий комментарий о теме обращения"
                            type="time"
                            name="comment_first"
                            value={formdata.comment_first || ""}
                            onChange={(e, { name, value }) => changeData(name, value)}
                            error={errors.comment_first ? true : false}
                        />
                    </Form.Field>
                    : null
                }

                <Form.Field>
                    <label><Icon name="comment outline" />Описание проблемы (отразится в карточке клиента)</label>
                    <Form.TextArea
                        placeholder="Опишите суть обращения"
                        type="time"
                        name="comment"
                        rows={5}
                        value={formdata.comment || ""}
                        onChange={(e, { name, value }) => changeData(name, value)}
                        error={errors.comment ? true : false}
                    />
                </Form.Field>

            </Form>

        </Modal.Content>

        <Modal.Actions>
            <Button
                content="Отмена"
                onClick={() => setOpen(null)}
                basic
            />
            <Button
                positive
                icon="save"
                labelPosition="right"
                content="Создать"
                onClick={() => setSave(true)}
                disabled={loading || error}
            />
        </Modal.Actions>

    </Modal>

}

export default RequestAdd;