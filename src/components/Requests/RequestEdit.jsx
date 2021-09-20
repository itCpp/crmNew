import _ from "lodash";
import React from "react";
import axios from "./../../utils/axios-header";

import { Modal, Button, Grid, Dimmer, Loader, Form, Dropdown, Icon } from "semantic-ui-react";

const caseSensitiveSearch = (options, query) => {
    const re = new RegExp(_.escapeRegExp(query))
    return options.filter((opt) => re.test(opt.text))
}

const RequestEdit = props => {

    const { row, setOpen } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [save, setSave] = React.useState(null);
    const [errorSave, setErrorSave] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState(row);
    const [statuses, setStatuses] = React.useState([]);
    const [cities, setCities] = React.useState([]);
    const [themes, setThemes] = React.useState([]);
    const [adresses, setAddresses] = React.useState([]);

    React.useEffect(() => {

        axios.post('requests/getRow', {
            id: row.id
        }).then(({ data }) => {

            setFormdata(data.request);

            setCities(data.cities);
            setThemes(data.themes);

            setStatuses([{ text: "Не обработана", value: 0, id: 0 }, ...data.statuses]);

        }).catch(error => {
            setError(axios.getError(error));
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

            axios.post('requests/save', formdata).then(({ data }) => {
                setErrorSave(null);
            }).catch(error => {
                setError(null);
                setErrorSave(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    React.useEffect(() => console.log(formdata), [formdata]);

    return <Modal
        className="my-large"
        open={true}
        closeIcon
        onClose={() => setOpen(null)}
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>
            <span>Заявка №<span title="Номер заявки">{row.id}</span></span>
            {row.source?.name ? <span className="text-primary" title="Источник">{' '}{row.source.name}</span> : null}
        </Modal.Header>

        <Modal.Content className="position-relative">

            <Grid>

                <Grid.Column>

                    <Form>

                        <Form.Group>
                            <Form.Input
                                label="ФИО клиента"
                                placeholder="Укажите ФИО клиента"
                                width={16}
                                name="client_name"
                                value={formdata.client_name || ""}
                                onChange={(e, { name, value }) => changeData(name, value)}
                                error={errors.client_name ? true : false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Select
                                label="Статус"
                                placeholder="Укажите статус заявки"
                                width={16}
                                options={statuses.map((status, key) => ({
                                    ...status, key, value: status.id, text: status.text
                                }))}
                                name="status_id"
                                value={formdata.status_id || 0}
                                onChange={(e, { name, value }) => changeData(name, value)}
                                error={errors.status_id ? true : false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Field width={8}>
                                <label>Город</label>
                                <Dropdown
                                    placeholder="Укажите город"
                                    search={caseSensitiveSearch}
                                    selection
                                    options={cities.map((city, key) => ({
                                        key, value: city, text: city
                                    }))}
                                    name="region"
                                    value={formdata.region || ""}
                                    onChange={(e, { name, value }) => changeData(name, value)}
                                    error={errors.region ? true : false}
                                />
                            </Form.Field>
                            <Form.Field width={8}>
                                <label>Тематика</label>
                                <Dropdown
                                    placeholder="Укажите тематику"
                                    search={caseSensitiveSearch}
                                    selection
                                    options={themes.map((theme, key) => ({
                                        key, value: theme, text: theme
                                    }))}
                                    name="theme"
                                    value={formdata.theme || ""}
                                    onChange={(e, { name, value }) => changeData(name, value)}
                                    error={errors.theme ? true : false}
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Group>
                            <Form.Field width={8}>
                                <label><Icon name="map marker alternate" />Адрес</label>
                                <Form.Select
                                    placeholder="Укажите адрес офиса"
                                    options={adresses.map((addr, key) => ({
                                        key, value: addr.id, text: addr.name
                                    }))}
                                    name="address"
                                    value={formdata.address || ""}
                                    onChange={(e, { name, value }) => changeData(name, value)}
                                    error={errors.address ? true : false}
                                />
                            </Form.Field>
                            <Form.Field width={8}>
                                <label><Icon name="calendar check outline" />Дата</label>
                                <Form.Input
                                    placeholder="Укажите дату"
                                    type="date"
                                    name="event_date"
                                    value={formdata.event_date || ""}
                                    onChange={(e, { name, value }) => changeData(name, value)}
                                    error={errors.event_date ? true : false}
                                />
                            </Form.Field>
                            <Form.Field width={8}>
                                <label><Icon name="clock" />Время</label>
                                <Form.Input
                                    placeholder="Укажите время"
                                    type="time"
                                    name="event_time"
                                    value={formdata.event_time || ""}
                                    onChange={(e, { name, value }) => changeData(name, value)}
                                    error={errors.event_time ? true : false}
                                />
                            </Form.Field>
                        </Form.Group>

                        <Form.Field>
                            <label><Icon name="comment outline" />Описание проблемы</label>
                            <Form.TextArea
                                fluid
                                placeholder="Опишите суть обращения"
                                type="time"
                                name="comment"
                                rows={5}
                                value={formdata.comment || ""}
                                onChange={(e, { name, value }) => changeData(name, value)}
                                error={errors.comment ? true : false}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label><Icon name="comment" />Комментарий юристу</label>
                            <Form.TextArea
                                fluid
                                placeholder="Комментарий для юриста перивчного приема"
                                type="time"
                                name="comment_urist"
                                value={formdata.comment_urist || ""}
                                onChange={(e, { name, value }) => changeData(name, value)}
                                error={errors.comment_urist ? true : false}
                            />
                        </Form.Field>

                    </Form>

                </Grid.Column>

            </Grid>

            {loading
                ? <Dimmer active inverted><Loader active /></Dimmer>
                : null
            }

        </Modal.Content>

        <Modal.Actions className="d-flex justify-content-between align-items-center">
            <div>
                {error ? <strong className="text-danger">{error}</strong> : null}
                {errorSave ? <strong className="text-danger">{errorSave}</strong> : null}
            </div>
            <div>
                <Button
                    color="linkedin"
                    content="Отмена"
                    onClick={() => setOpen(null)}
                />
                <Button
                    positive
                    icon="save"
                    labelPosition="right"
                    content="Сохранить"
                    onClick={() => setSave(true)}
                    disabled={loading || error}
                />
            </div>
        </Modal.Actions>

    </Modal>

}

export default RequestEdit;