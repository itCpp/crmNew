import React from "react";
import { Message } from "semantic-ui-react";
import MessageRow from "./MessageRow";

const ChatPlaceMessages = props => {

    const { data, changeMessage } = props;
    const place = React.useRef();

    const [page, setPage] = React.useState(1);
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {

        setPage(data?.page || 1);
        setMessages(data?.messages || []);

        return () => {
            setPage(1);
            setMessages([]);
        }

    }, [data]);

    React.useEffect(() => {

        if (changeMessage) {

            setMessages(p => {

                const messages = [...p];
                let append = true;

                messages.forEach((row, i) => {
                    if ((changeMessage?.micro_id && row.micro_id === changeMessage.micro_id) || (changeMessage?.id && row.id === changeMessage.id)) {
                        append = false;
                        messages[i] = { ...row, ...changeMessage }
                    }
                });

                if (append)
                    messages.unshift(changeMessage);

                return messages;

            });
        }

    }, [changeMessage]);

    return <div ref={place} className="d-flex flex-column-reverse place-messages-rows">

        {messages.map(row => <MessageRow
            key={row.id || row.micro_id}
            row={row}
        />)}

        {messages.length === 0 && <Message
            content="Ссобщений ещё нет"
            className="chat-message-ui text-center mx-auto my-2"
            size="mini"
        />}

    </div>
}

export default ChatPlaceMessages;