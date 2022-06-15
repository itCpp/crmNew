import React from "react";
import { Icon } from "semantic-ui-react";
import moment from "../../../../utils/moment";

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

export default MessageRow;