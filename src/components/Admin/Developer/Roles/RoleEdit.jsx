import React from 'react';
import axios from './../../../../utils/axios-header';

import { Modal, Button, Form, Message } from 'semantic-ui-react';

function RoleEdit(props) {

    const { open, setOpen, roles, setRoles, setRole } = props;

    const [loading, setLoading] = React.useState(true);

    const [formdata, setFormdata] = React.useState({});
    const [save, setSave] = React.useState(false);

    const [error, setError] = React.useState(false);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {

        if (save) {

            setLoading(true);

            axios.post('dev/saveRole', { ...formdata, edit: open }).then(({ data }) => {

                let newRoles = [...roles],
                    push = true;

                roles.forEach((role, i) => {

                    if (role.role === data.role.role) {
                        push = false;
                        newRoles[i] = data.role;
                    }

                });

                if (push)
                    newRoles.push(data.role);

                setRoles(newRoles);
                setRole(data.role);
                setOpen(false);

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

        if (open && open !== true) {

            setLoading(true);

            axios.post('dev/getRole', { role: open }).then(({ data }) => {
                setFormdata(data.role);
            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoading(false);
            });

        }
        else if (open)
            setLoading(false);

    }, [open]);

    const changeData = el => setFormdata({ ...formdata, [el.target.name]: el.target.value });

    return <Modal
        centered={false}
        open={open ? true : false}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="mini"
        closeOnDimmerClick={false}
        closeOnEscape={false}
        closeIcon
    >
        <Modal.Header>{open === true ? "Создание роли" : "Изменить роль"}</Modal.Header>

        <Modal.Content>

            <Form loading={loading}>

                {open === true
                    ? <Form.Input
                        label="Идентификатор"
                        placeholder="Введите идентификатор роли..."
                        className="mb-1"
                        required
                        name="role"
                        value={formdata.role || ""}
                        onChange={changeData}
                        error={errors.role || false}
                    />
                    : <h4 className="mb-3 text-primary">{formdata.role || "..."}</h4>
                }
                <div className="mb-3">
                    <small>Идентификатор необходимо вводить строго латинскими буквами, цифрами и без символов, разрешено нижнее подчеркивание</small>
                </div>

                <Form.Input
                    label="Наименование для вывода"
                    placeholder="Введите наименование роли..."
                    name="name"
                    value={formdata.name || ""}
                    onChange={changeData}
                    error={errors.name || false}
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
                ? <Message error>{error}</Message>
                : null
            }

        </Modal.Content>

        <Modal.Actions>
            <Button
                onClick={() => setSave(true)}
                content={open === true ? "Создать" : "Сохранить"}
                primary
                disabled={loading}
            />
        </Modal.Actions>

    </Modal>

}

export default RoleEdit;