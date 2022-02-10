import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Modal, Dimmer, Loader, Message } from "semantic-ui-react";

import StatusForm from "./StatusForm";

const CreateStatus = props => {

    const { statuses, setStatuses } = props;

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [create, setCreate] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});

    const [open, setOpen] = React.useState(false);
    const trigger = <Button
        icon="plus"
        basic
        positive={!error ? true : false}
        negative={error ? true : false}
        title="Добавить новый статус"
        circular
        loading={create}
        disabled={create}
        onClick={() => setOpen(true)}
    />;

    React.useEffect(() => {

        if (!open) {
            setLoad(false);
            setError(null);
            setErrors({});
            setCreate(null);
            setFormdata({});
        }

    }, [open]);

    React.useEffect(() => {

        if (create) {

            setLoad(true);

            axios.post('dev/createStatus', formdata).then(({ data }) => {

                if (typeof setStatuses == "function")
                    setStatuses([data.status, ...statuses]);

                setOpen(false);

            }).catch(error => {
                setError(axios.getError(error));
                setErrors(axios.getErrors(error));
            }).then(() => {
                setLoad(false);
            });

        }

        return () => setCreate(false);

    }, [create]);

    return <Modal
        closeIcon
        open={open}
        trigger={trigger}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="tiny"
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>Новый статус для заявки</Modal.Header>
        <Modal.Content className="position-relative">

            <StatusForm
                formdata={formdata}
                setFormdata={setFormdata}
                errors={errors}
            />

            {error
                ? <Message error content={error} className="mb-0" />
                : null
            }

            <Dimmer active={load} inverted>
                <Loader inverted />
            </Dimmer>

        </Modal.Content>

        <Modal.Actions>
            <Button
                color="black"
                onClick={() => setOpen(false)}
                content="Отмена"
            />
            <Button
                content="Создать"
                labelPosition="right"
                icon="save"
                onClick={() => setCreate(true)}
                positive
                disabled={load}
            />
        </Modal.Actions>

    </Modal>

}

export default CreateStatus;