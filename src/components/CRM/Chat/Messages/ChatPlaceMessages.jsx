import React from "react";
import { Icon } from "semantic-ui-react";
import moment from "../../../../utils/moment";

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

    </div>
}

const MessageRow = props => {

    const { row } = props;
    const className = ["chat-message-row"];

    const interval = React.useRef();
    const [time, setTime] = React.useState(moment(row.created_at).fromNow());

    if (row.my)
        className.push('my-chat-message');

    React.useEffect(() => {

        interval.current = setInterval(() => setTime(moment(row.created_at).fromNow()), 5000);

        return () => {
            interval.current && clearInterval(interval.current);
        }

    }, []);

    return <div id={`chat-message-row-${row.id}`} className={className.join(" ")}>

        <div>{row.message}</div>

        <div className="d-flex align-items-center time-message justify-content-end">

            <small title={moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")} className="opacity-50">{time}</small>

            {row.loading && <span title="Отправка">
                <Icon name="clock" size="small" />
            </span>}

            {row.error && <span title={row.error}>
                <Icon name="warning sign" size="small" color="red" />
            </span>}

            {!row.loading && !row.error && <span title="Отправлено">
                <Icon name="check" size="small" disabled />
            </span>}

        </div>

    </div>
}

export default ChatPlaceMessages;