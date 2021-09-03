import React from "react";
import axios from "./../../../utils/axios-header";

import { Modal, Form, Message, Button } from 'semantic-ui-react';

function CallcenterModal(props) {

    const { edit, setOpen, addCallcenter } = props;

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [formdata, setFormdata] = React.useState({});

    const [save, setSave] = React.useState(false);

    React.useEffect(() => {

        if (edit !== true) {

            setLoading(true);

            axios.post('admin/getCallcenter', {
                id: edit,
            }).then(({ data }) => {
                setFormdata(data.callcenter || {});
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoading(false);
            });

        }
        else
            setLoading(false);

    }, [edit]);

    const changeData = el => setFormdata({ ...formdata, [el.target.name]: el.target.value });

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('admin/saveCallcenter', {
                ...formdata,
            }).then(({ data }) => {
                addCallcenter(data.callcenter);
                setOpen(null);
            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    return <Modal
        centered={false}
        open={edit ? true : false}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="mini"
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
    >
        <Modal.Header>{edit === true ? "Создать новый колл-центр" : "Изменить данные"}</Modal.Header>

        <Modal.Content>

            <Form loading={loading}>

                <Form.Input
                    label="Наименование"
                    placeholder="Введите наименование колл-центра..."
                    required
                    name="name"
                    value={formdata.name || ""}
                    onChange={changeData}
                    error={errors.name ? true : false}
                />

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Короткое описание..."
                    rows={5}
                    name="comment"
                    value={formdata.comment || ""}
                    onChange={changeData}
                />

            </Form>

            {error
                ? <Message error>{errors ? "Имеются ошибки" : error}</Message>
                : null
            }

        </Modal.Content>

        <Modal.Actions>
            <Button
                onClick={() => setSave(true)}
                content="Сохранить"
                primary
                disabled={loading}
            />
        </Modal.Actions>

    </Modal>

}

export default CallcenterModal;