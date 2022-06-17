import React from "react";
import { Message } from "semantic-ui-react";
import MessageRow from "./MessageRow";

const ChatPlaceMessages = props => {

    const { data, fired } = props;
    const { changeMessage, pushMessage } = props;
    const place = React.useRef();
    const { messages } = data;

    React.useEffect(() => {
        if (changeMessage) pushMessage(changeMessage);
    }, [changeMessage]);

    return <div ref={place} className="d-flex flex-column-reverse place-messages-rows">

        {fired && <Message
            content="Сотрудник уволен"
            className="chat-message-ui text-center mx-auto my-2"
            size="mini"
            color="black"
        />}

        {messages.length === 0 && <Message
            content="Ссобщений ещё нет"
            className="chat-message-ui text-center mx-auto my-2"
            size="mini"
        />}

        {messages.map(row => <MessageRow
            key={row.id || row.micro_id}
            row={row}
        />)}

    </div>
}

export default ChatPlaceMessages;