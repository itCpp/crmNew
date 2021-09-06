import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Modal, Input, Dimmer, Loader, Message } from "semantic-ui-react";

const CreateSource = props => {

    const { resources, setResources } = props;

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);

    const [create, setCreate] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});

    const [open, setOpen] = React.useState(false);
    const [trigger, setTrigger] = React.useState(<Button
        icon="plus"
        basic
        positive={!error ? true : false}
        negative={error ? true : false}
        title="Добавить новый ресурс"
        size="mini"
        circular
        loading={create}
        disabled={create}
        onClick={() => setOpen(true)}
    />);


    React.useEffect(() => {

        if (open) {
            setLoad(false);
            setError(null);
            setCreate(null);
            setFormdata({});
        }

    }, [open]);

    React.useEffect(() => {

        if (create) {

            setLoad(true);

            axios.post('dev/createResource', formdata).then(({ data }) => {

                if (typeof setResources == "function")
                    setResources([data.resource, ...resources]);

                setOpen(false);

            }).catch(error => {
                setError(axios.getError(error));
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
        size="mini"
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>Новый ресурс</Modal.Header>
        <Modal.Content className="position-relative">

            <p>Введите номер телефона в любом формате или адрес сайта. Тип ресурса будет определен автоматически</p>

            <Input
                name="resource"
                placeholder="Введите ресурс..."
                fluid
                onChange={e => setFormdata({ ...formdata, [e.currentTarget.name]: e.currentTarget.value })}
                value={formdata.resource || ""}
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
                content="Добавить"
                labelPosition="right"
                icon="save"
                onClick={() => setCreate(true)}
                positive
                disabled={load}
            />
        </Modal.Actions>

    </Modal>

}

export default CreateSource;