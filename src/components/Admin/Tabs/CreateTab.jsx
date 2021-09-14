import React from "react";
import axios from "./../../../utils/axios-header";

import { Button, Modal, Dimmer, Loader, Message, Icon } from "semantic-ui-react";

import TabForm from "./Form/TabForm";

const CreateTab = props => {

    const { tabs, setTabs } = props;

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [errors, setErrors] = React.useState({});

    const [create, setCreate] = React.useState(null);
    const [formdata, setFormdata] = React.useState({});

    const [open, setOpen] = React.useState(false);

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

            axios.post('dev/createTab', formdata).then(({ data }) => {

                if (typeof setTabs == "function")
                    setTabs([data.tab, ...tabs]);

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
        trigger={<Button
            icon="plus"
            basic
            positive={!error ? true : false}
            negative={error ? true : false}
            title="Создать новую вкладку"
            size="mini"
            circular
            loading={create}
            disabled={create}
            onClick={() => setOpen(true)}
        />}
        onClose={() => setOpen(false)}
        size="tiny"
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>
            <Icon name="plus" />
            <span>Новая вкладка</span>
        </Modal.Header>

        <Modal.Content className="position-relative">

            <TabForm
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

export default CreateTab;