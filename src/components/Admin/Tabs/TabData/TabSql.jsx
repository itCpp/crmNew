import React from "react";
import axios from "./../../../../utils/axios-header";

import { Button, Modal, Dimmer, Loader, Message, Icon } from "semantic-ui-react";

const TabSql = props => {

    const { id, where } = props;

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState(false);

    React.useEffect(() => {

        if (!open) {
            setLoad(true);
            setError(null);
            setMessage(false);
        }
        else {

            setLoad(true);

            axios.post('dev/getSql', { id, where }).then(({ data }) => {
                setMessage(data.message);
            }).catch(error => {
                setError(axios.getError(error));
            }).then(() => {
                setLoad(false);
            });

        }

    }, [open]);

    return <Modal
        closeIcon
        open={open}
        trigger={<Button
            content="Получить запрос"
            title="Проверить сформированный запрос"
            color="blue"
            basic
            icon="code"
            labelPosition="right"
        />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="tiny"
        centered={false}
        closeOnDimmerClick={false}
        closeOnEscape={false}
    >

        <Modal.Header>
            <Icon name="code" style={{ marginRight: "1rem" }} />
            <span>MySQL запрос</span>
        </Modal.Header>

        <Modal.Content className="position-relative">

            {error
                ? <Message error content={error} className="mb-0" />
                : <Message info content={message || "Запрос формируется"} className="mb-0" />
            }

            <Dimmer active={load} inverted>
                <Loader inverted />
            </Dimmer>

        </Modal.Content>

        <Modal.Actions>
            <Button
                content="Закрыть"
                onClick={() => setOpen(false)}
                positive
                basic
            />
        </Modal.Actions>

    </Modal>

}

export default TabSql;