import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Modal, Message, Icon, Form, Input, Checkbox, Dropdown } from "semantic-ui-react";

import places from "./../../../data/ad_places";

const ExtensionModal = props => {

    const { id, setOpen, setExtensions } = props;
    const { sip, setSip, setCalls } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [create, setCreate] = React.useState(null);
    const [formdata, setFormdata] = React.useState({ on_work: 1 });
    const [resources, setResources] = React.useState([]);

    const ad_places = places.map((place, i) => ({ key: i, ...place }));

    React.useEffect(() => {

        if (id !== null) {

            axios.post('dev/getIncomingCallExtension', { id }).then(({ data }) => {

                setFormdata(data.extension || { extension: sip, on_work: 1 });

                let find = false;
                data.resources.forEach(row => {
                    if (row.val === data.extension.phone)
                        find = true;
                });

                if (!find)
                    data.resources = [{ val: data.extension.phone }, ...data.resources];

                setResources(data.resources);

            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoad(false);
            });
        }

    }, []);

    const onChange = (e, { name, value, type, checked }) => {

        if (['checkbox', 'radio'].indexOf(type) >= 0)
            value = checked === true ? 1 : 0;

        setFormdata(prev => ({ ...prev, [name]: value }));
    }

    const onAddItemPhone = (e, { value }) => {
        setResources(prev => [...prev, { val: value }]);
    }

    React.useEffect(() => {

        if (create) {

            setLoad(true);

            axios.post("dev/saveIncpmingExtension", formdata).then(({ data }) => {

                setExtensions(list => {
                    let added = false;

                    list.forEach((row, i) => {
                        if (row.id === data.extension.id) {
                            list[i] = data.extension;
                            added = true;
                        }
                    });

                    if (!added)
                        list = [data.extension, ...list];

                    return list;
                });

                setCalls(list => {

                    list.forEach((row, i) => {
                        if (row.sip === data.extension.extension) {
                            list[i].source = data.extension;
                        }
                    });

                    return list;

                });

                if (data.alert) {
                    axios.toast(data.alert, {
                        type: 'warning',
                        time: 0,
                    });
                }

                setSip(null);
                setOpen(null);

            }).catch(error => {
                axios.toast(error);
                setErrors(axios.getErrors(error));
                setLoad(false);
            });

        }

        return () => setCreate(false);

    }, [create]);

    return <Modal
        closeIcon
        open={id ? true : false}
        onClose={() => setOpen(null)}
        size="tiny"
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>
            <Icon name={id === null ? "plus" : "edit"} />
            <span>{id === true ? 'Новый слушатель' : 'Редактирование слушателя'}</span>
        </Modal.Header>

        <Modal.Content className="position-relative">

            <Form loading={load}>

                <Form.Field
                    control={Input}
                    label="SIP аккаунт"
                    placeholder="Укажите аккаунт слушателя"
                    required
                    disabled={error}
                    name="extension"
                    value={formdata.extension || ""}
                    onChange={onChange}
                    error={errors.extension ? true : false}
                />

                <Form.Field required>
                    <label>Номер источника</label>
                    <Dropdown
                        selection
                        search
                        allowAdditions
                        options={resources.map((row, key) => ({
                            key,
                            text: row.val,
                            value: row.val,
                            content: (<div className="d-flex align-items-center justify-content-between">
                                <div>{row.val}</div>
                                {row.source && <div style={{ opacity: 0.5 }}><small>{row.source.name || `Источник #${row.source.id}`}</small></div>}
                            </div>)
                        }))}
                        placeholder="Укажите номер телефона"
                        name="phone"
                        value={formdata.phone || ""}
                        onChange={onChange}
                        error={errors.phone ? true : false}
                        onAddItem={onAddItemPhone}
                    />
                </Form.Field>

                <Form.Field>
                    <label>Рекламная площадка</label>
                    <Dropdown
                        selection
                        options={ad_places}
                        placeholder="Выберите рекламную площадку"
                        name="ad_place"
                        value={formdata.ad_place || ""}
                        onChange={onChange}
                        error={errors.ad_place ? true : false}
                    />
                </Form.Field>

                <Checkbox
                    toggle
                    label={formdata.on_work === 1 ? "Слушатель включен в работу" : "Слушатель отключен"}
                    disabled={error}
                    name="on_work"
                    checked={formdata.on_work === 1 ? true : false}
                    onChange={onChange}
                    className="mb-3"
                />

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Укажите комментарий к слушателю..."
                    disabled={error}
                    name="comment"
                    value={formdata.comment || ""}
                    onChange={onChange}
                />

            </Form>

            {error && <Message error content={error} className="mb-0" size="tiny" />}

        </Modal.Content>

        <Modal.Actions>
            <Button
                color="black"
                onClick={() => setOpen(null)}
                content="Отмена"
            />
            <Button
                content={id === null ? "Создать" : "Сохранить"}
                labelPosition="right"
                icon="save"
                onClick={() => setCreate(true)}
                positive
                disabled={load || error}
            />
        </Modal.Actions>

    </Modal>;

}

export default ExtensionModal;