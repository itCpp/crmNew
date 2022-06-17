import React from "react";
import { axios } from "../../../../utils";
import TextareaAutosize from "react-textarea-autosize";
import { useSelector } from "react-redux";
import useSetRooms from "../useSetRooms";

const SendMessage = props => {

    const { chatId, userId, disabled, setChangeMessage } = props;
    const { userData } = useSelector(state => state.main);
    const { updateRooms } = useSetRooms(props.setRooms, userData.id);
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
            user_id: userId,
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

            updateRooms(data.room);

        }).catch(e => {
            setChangeMessage({
                ...formdata,
                loading: false,
                error: axios.getError(e),
            });
        });

    }, [chatId, userId]);

    const clickTextArea = React.useCallback(e => {

        if (e.ctrlKey && e.keyCode === 13) {
            setMessage(p => (p + "\n"));
        } else if (e.keyCode === 13) {
            e.preventDefault();
            sendMessage(e.target.value);
        }

    }, [chatId, userId]);

    return <div className="mt-2">

        <TextareaAutosize
            autoFocus
            className="chat-message-textarea pt-2"
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