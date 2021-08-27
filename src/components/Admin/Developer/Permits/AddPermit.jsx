import React from 'react';
import axios from './../../../../utils/axios-header';

import { Modal, Button, Form, Message } from 'semantic-ui-react';

function AddPermit(props) {

    const { open, setOpen, edit, addedPermit } = props;

    const [loading, setLoading] = React.useState(false);
    const [save, setSave] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [formData, setFormData] = React.useState({});

    const [errorEdit, setErrorEdit] = React.useState(false);

    React.useEffect(() => {

        if (open && !edit) {
            setError(false);
            setErrors({});
            setErrorEdit(false);
            setLoading(false);
            setFormData({});
        }
        else if (!open) {
            setError(false);
            setErrorEdit(false);
            setLoading(false);
            setErrors({});
            setFormData({});
        }

    }, [open]);

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('dev/savePermit', formData).then(({ data }) => {

                setError(false);
                setErrors({});
                setOpen(false);

                addedPermit({ ...data.permit, new: true }, edit ? true : false);

            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoading(false);
            });

        }

        return () => setSave(false);

    }, [save]);

    React.useEffect(() => {

        if (edit) {

            setLoading(true);

            axios.post('dev/getPermit', edit).then(({ data }) => {

                setError(false);
                setErrorEdit(false);
                setErrors({});

                setFormData({ ...data.permit, edit: true });

            }).catch(error => {
                error = axios.getError(error);
                setError(error);
                setErrorEdit(error);
            }).then(() => {
                setLoading(false);
            });

        }

    }, [edit]);

    const changeData = el => {

        let name = el.target.name,
            value = el.target.value,
            data = { ...formData };

        data[name] = value;
        setFormData(data);

    }

    return <Modal
        centered={false}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="mini"
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
    >
        <Modal.Header>{edit ? "Изменить правило" : "Новое правило"}</Modal.Header>

        <Modal.Content>

            <Form
                loading={loading}
            >

                {edit
                    ? <h4 className="mb-3 text-primary">{formData.permission || "..."}</h4>
                    : <Form.Input
                        label="Наименование"
                        placeholder="Введите наименование правила..."
                        className="mb-1"
                        required
                        name="permission"
                        value={formData.permission || ""}
                        onChange={changeData}
                        error={errors.permission || false}
                    />
                }
                <div className="mb-3">
                    <small>Наименование правила необходимо указывать только латинскими буквами и без символов. Разрешено нижнее подчеркивание</small>
                </div>

                <Form.TextArea
                    label="Комментарий"
                    placeholder="Короткое описание..."
                    rows={5}
                    name="comment"
                    value={formData.comment || ""}
                    onChange={changeData}
                />

            </Form>

            {error
                ? <Message error>{error}</Message>
                : null
            }

        </Modal.Content>

        <Modal.Actions>
            <Button
                onClick={() => setSave(true)}
                content={edit ? "Сохранить" : "Создать"}
                primary
                disabled={loading || errorEdit}
            />
        </Modal.Actions>

    </Modal>


}

export default AddPermit;