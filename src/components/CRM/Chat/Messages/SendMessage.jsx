import React from "react";
import { axios } from "../../../../utils";
import TextareaAutosize from "react-textarea-autosize";

const SendMessage = props => {

    const { chatId, disabled, setChangeMessage } = props;
    const [error, setError] = React.useState(null);
    const [message, setMessage] = React.useState("");

    const sendMessage = React.useCallback(message => {

        if (String(message).trim().length === 0) return;

        setMessage("");

        const formdata = {
            micro_id: Date.now(),
            message,
            my: true,
            chat_id: chatId,
            loading: true,
            created_at: new Date,
        }

        setChangeMessage(formdata);

        axios.post('users/chat/sendMessage', formdata).then(({ data }) => {
            setChangeMessage({
                micro_id: formdata.micro_id,
                loading: false,
                error: null,
                ...data.message,
            });
        }).catch(e => {
            setChangeMessage({
                ...formdata,
                loading: false,
                error: axios.getError(e),
            });
        });

    }, [chatId]);

    const clickTextArea = React.useCallback(e => {

        if (e.ctrlKey && e.keyCode === 13) {
            setMessage(p => (p + "\n"));
        } else if (e.keyCode === 13) {
            e.preventDefault();
            sendMessage(e.target.value);
        }

    }, [chatId]);

    return <div className="mt-2 pt-2" style={{ background: "#ffffff" }}>

        <TextareaAutosize
            autoFocus
            className="chat-message-textarea"
            placeholder="Введите текст сообщения..."
            disabled={disabled}
            value={message}
            onChange={e => setMessage(e.target.value)}
            maxRows={10}
            onKeyDown={clickTextArea}
        />

    </div>
}

export default SendMessage;