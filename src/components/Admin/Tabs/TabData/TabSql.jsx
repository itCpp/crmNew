import React from "react";
import axios from "./../../../../utils/axios-header";

import { Button, Modal, Dimmer, Loader, Message, Icon } from "semantic-ui-react";

const TabSql = props => {

    const { id, where, orderBy, target, fluid } = props;

    const [load, setLoad] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState(false);
    const [query, setQuery] = React.useState(false);

    React.useEffect(() => {

        if (!open) {
            setLoad(true);
            setError(null);
            setMessage(false);
        }
        else {

            setLoad(true);

            axios.post('dev/tabs/sql', { id, where, orderBy }).then(({ data }) => {
                setMessage(data.message);
                setQuery(data.full);
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
        trigger={target || <Button
            content="Проверить SQL запрос"
            title="Проверить сформированный запрос"
            color="blue"
            basic
            icon="code"
            labelPosition="right"
            fluid={fluid || false}
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
            <span>SQL запрос</span>
        </Modal.Header>

        <Modal.Content className="position-relative">

            {error && <Message error content={error} className="mb-0" />}

            {!error && <>
                <strong>Короткий запрос с настраиваемыми условиями</strong>
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word !important",
                        color: "#000000"
                    }}
                    children={message || "Запрос формируется..."}
                />
            </>}

            {!error && <>
                <strong>Полный запрос при выводе заявок</strong>
                <pre
                    style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word !important",
                        color: "#000000"
                    }}
                    children={query || "Полный запрос формируется..."}
                />
            </>}

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