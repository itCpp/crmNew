import React from "react";
import axios from "./../../../utils/axios-header";

import { Modal, Form, Message, Button } from 'semantic-ui-react';

const SectorModal = props => {

    const { callcenter, sector, setOpen, setSectors, setAutoSector, setDefaultSector } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    const [formdata, setFormdata] = React.useState({});
    const [formdataControl, setFormdataControl] = React.useState({});
    const [save, setSave] = React.useState(false);

    const changedData = JSON.stringify(formdata) === JSON.stringify(formdataControl);

    const changeData = React.useCallback((e, { name, value, type, checked }) => {

        if (type === "checkbox")
            value = checked ? 1 : 0;

        value = value === "" ? null : value;

        setFormdata(prev => ({ ...prev, [name]: value }));

    }, []);

    React.useEffect(() => {

        if (sector === true) {
            setLoading(false);
        }
        else if (typeof sector == "number") {

            axios.post('admin/getSector', { sector }).then(({ data }) => {
                setFormdata(data.sector);
                setFormdataControl(data.sector);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });

        }

    }, [sector]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('admin/saveSector', { ...formdata, callcenter }).then(({ data }) => {

                setSectors(prev => {

                    if (sector === true)
                        return [data.sector, ...prev];

                    prev.forEach((row, i) => {
                        if (row.id === data.sector.id) {
                            prev[i] = data.sector;
                        }
                    });

                    return prev;

                });

                setAutoSector(Number(data.auto_set));
                setDefaultSector(data.default_sector);
                setOpen(false);

            }).catch(e => {
                axios.toast(e, { time: 10000 });
                setErrors(axios.getErrors(e));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        centered={false}
        open={sector ? true : false}
        onClose={() => setOpen(false)}
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
        size="tiny"
    >

        <Modal.Header>{sector === true ? "Создать новый сектор" : "Изменить данные сектора"}</Modal.Header>

        <Modal.Content>

            <Form loading={loading}>

                <Form.Input
                    label="Наименование"
                    placeholder="Введите наименование сектора..."
                    required
                    name="name"
                    value={formdata.name || ""}
                    onChange={changeData}
                    error={errors.name ? true : false}
                    disabled={error ? true : false}
                />

                <Form.Checkbox
                    toggle
                    label="Включить сектор в работу"
                    name="active"
                    checked={formdata.active === 1 ? true : false}
                    onChange={changeData}
                    disabled={error ? true : false}
                />

                <Form.Checkbox
                    toggle
                    label="Автоматически устанавливать сектор новой заявке"
                    name="auto_set"
                    checked={formdata.auto_set === 1}
                    onChange={changeData}
                    disabled={error ? true : false}
                />

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Короткое описание..."
                    rows={5}
                    name="comment"
                    value={formdata.comment || ""}
                    onChange={changeData}
                    disabled={error ? true : false}
                />

            </Form>

            {error && <Message error content={error} />}

        </Modal.Content>

        <Modal.Actions>
            <Button
                onClick={() => setSave(true)}
                content="Сохранить"
                primary
                disabled={loading || changedData || (error ? true : false)}
            />
        </Modal.Actions>

    </Modal>

}

export default SectorModal;