import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Modal, Message, Icon, Form, Input, Checkbox } from "semantic-ui-react";

const ExtensionModal = props => {

    const { id, setOpen, setExtensions } = props;
    const { sip, setSip, setCalls } = props;

    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [create, setCreate] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});

    React.useEffect(() => {

        if (id === true) {
            setFormdata(prev => ({ ...prev, extension: sip }));
            setLoad(false);
        }
        else {
            axios.post('dev/getIncomingCallExtension', { id }).then(({ data }) => {
                setFormdata(data.extension);
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

                <Form.Field
                    control={Input}
                    label="Номер источника"
                    placeholder="Укажите номер телефона"
                    required
                    disabled={error}
                    name="phone"
                    value={formdata.phone || ""}
                    onChange={onChange}
                    error={errors.phone ? true : false}
                />

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