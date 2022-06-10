import React from "react";
import _ from "lodash";
import axios from "./../../../utils/axios-header";

import { Icon, Message, Form, Button, Grid, Dropdown } from "semantic-ui-react";

import OfficeDataSettings from "./OfficeDataSettings";

const OfficeData = props => {

    const { office, setOffices, setOffice } = props;
    const segment = React.useRef();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState({});
    const [statuses, setStatuses] = React.useState([]);
    const [gates, setGates] = React.useState([]);
    const [sectors, setSectors] = React.useState([]);
    const [baseId, setBaseId] = React.useState([]);
    const [save, setSave] = React.useState(false);

    const [hash, setHash] = React.useState(null);

    React.useEffect(() => {

        setLoading(true);

        axios.post('dev/getOffice', {
            id: office,
            forSetting: true
        }).then(({ data }) => {

            if (data?.office?.settings && data.office.settings.length === 0)
                data.office.settings = [{}];

            setFormdata(data.office);

            setHash(JSON.stringify(data.office));
            setStatuses(data.statuses);
            setSectors(data.sectors);
            setGates(data.gates);
            setBaseId(data.synh);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

    }, [office]);

    const onChange = React.useCallback((e, { name, value, type, checked }) => {

        if (type === "checkbox")
            value = checked ? 1 : 0;

        setFormdata(prev => ({ ...prev, [name]: value }));

    }, []);

    const setSelected = React.useCallback(value => onChange(null, { name: 'statuses', value }), []);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('dev/saveOffice', formdata).then(({ data }) => {

                if (data?.office?.settings && data.office.settings.length === 0)
                    data.office.settings = [{}];

                setOffices(prev => {

                    if (formdata.id) {
                        prev.forEach((row, i) => {
                            if (row.id === data.office.id) {
                                prev[i] = { ...row, ...data.office }
                            }
                        });
                    }
                    else {
                        prev.unshift(data.office);
                    }

                    return prev;

                });

                setFormdata(data.office);
                setHash(JSON.stringify(data.office));

                setErrors({});

            }).catch(e => {
                axios.toast(e);
                setErrors(axios.getErrors(e));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <div className="admin-content-segment" ref={segment}>

        <div className="divider-header">
            <div className="d-flex align-items-center">
                <span>
                    <Icon
                        name="arrow left"
                        className="button-icon mr-3"
                        onClick={() => setOffice(false)}
                        size="large"
                        title="Назад"
                    />
                </span>
                <h3>Настройка офиса{' '}{formdata.name || null}</h3>
            </div>
        </div>

        {error && <Message error content={error} />}

        <Form loading={loading}>

            <Form.Group>
                <Form.Input
                    label="Наименование офиса"
                    placeholder="Укажите наименование офиса"
                    name="name"
                    value={formdata.name || ""}
                    error={errors.name ? true : false}
                    onChange={onChange}
                    disabled={!loading && (error ? true : false)}
                    width={9}
                    required
                />

                <Form.Select
                    label="Синхронизация с БАЗАми"
                    placeholder="Выберите офис в базах"
                    name="base_id"
                    value={formdata.base_id || null}
                    error={errors.base_id ? true : false}
                    onChange={onChange}
                    disabled={(!loading && (error ? true : false)) || (baseId.length === 0)}
                    options={[{ value: null, text: "Не синхронизировать" }, ...baseId].map((row, i) => ({ ...row, key: i }))}
                    width={7}
                />
            </Form.Group>

            <Form.Checkbox
                toggle
                label="Сделать активным в списке адресов для записи клиента"
                name="active"
                checked={formdata.active === 1 ? true : false}
                onChange={onChange}
                disabled={!loading && (error ? true : false)}
            />

            <Form.Group>

                <Form.Input
                    label="Короткий адрес"
                    placeholder="Наример: ул. Моховая, д. 1"
                    name="addr"
                    value={formdata.addr || ""}
                    error={errors.addr ? true : false}
                    onChange={onChange}
                    disabled={!loading && (error ? true : false)}
                    width={10}
                    required
                />

                <Form.Input
                    label="Телефон секретаря"
                    placeholder="Укажите номер телефана секретаря"
                    name="tel"
                    value={formdata.tel || ""}
                    error={errors.tel ? true : false}
                    onChange={onChange}
                    disabled={!loading && (error ? true : false)}
                    width={6}
                />

            </Form.Group>

            <Form.TextArea
                label="Полный адрес"
                placeholder="Укажите полный адрес офиса"
                name="address"
                value={formdata.address || ""}
                error={errors.address ? true : false}
                onChange={onChange}
                disabled={!loading && (error ? true : false)}
                required
            />

            <hr />

            <h4 className="mt-1">Шаблон СМС</h4>

            <Grid columns={2}>
                <Grid.Row stretched>
                    <Grid.Column width={12}>
                        <Form.TextArea
                            placeholder="Введите текст сообщения..."
                            name="sms"
                            value={formdata.sms || ""}
                            error={errors.sms ? true : false}
                            onChange={onChange}
                            disabled={!loading && (error ? true : false)}
                            style={{ height: '100%' }}
                        />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <div className="segment-copy">
                            <div><b>Переменные:</b></div>
                            <div><code>${`{date}`}</code> <small>дата записи</small></div>
                            <div><code>${`{time}`}</code> <small>время записи</small></div>
                            <div><code>${`{pin}`}</code> <small>оператор</small></div>
                            <div><code>${`{id}`}</code> <small>номер заявки</small></div>
                            <div><code>${`{tel}`}</code> <small>номер секретаря</small></div>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <StatusesDropdown
                statuses={statuses}
                selectedStatuses={formdata.statuses || []}
                setSelectedStatuses={setSelected}
            />

            <OfficeDataSettings
                formdata={formdata}
                onChange={onChange}
                gates={gates}
                sectors={sectors}
            />

        </Form>

        <div className="mt-3 d-flex justify-content-between align-items-center">
            <Button
                color="blue"
                content="Отмена"
                onClick={() => setOffice(false)}
                icon="arrow left"
                labelPosition="left"
                disabled={loading}
            />
            <Button
                color="green"
                content="Сохранить"
                icon="save"
                labelPosition="right"
                disabled={loading || error || (hash === JSON.stringify(formdata))}
                onClick={() => setSave(true)}
            />
        </div>

    </div>

}

const StatusesDropdown = props => {

    const { statuses, selectedStatuses, setSelectedStatuses } = props;
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleChange = (e, { searchQuery, value }) => {
        setSearchQuery(searchQuery);
        setSelectedStatuses(value);
    }

    const handleSearchChange = (e, { searchQuery }) => setSearchQuery(searchQuery);

    return <>
        <div className="mt-3 mb-1"><b>Статусы заявок для подготовки шаблона</b></div>
        <Dropdown
            fluid
            multiple
            onChange={handleChange}
            onSearchChange={handleSearchChange}
            options={statuses.map(row => ({
                key: row.id,
                value: row.id,
                text: row.name,
            }))}
            placeholder='Статусы для подготовки шаблона'
            search
            searchQuery={searchQuery}
            selection
            value={selectedStatuses}
        />
    </>

}

export default OfficeData;