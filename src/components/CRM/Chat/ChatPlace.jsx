import { axios } from "../../../utils";
import React from "react";
import { Icon, Label, Loader, Message } from "semantic-ui-react";
import ChatPlaceMessages from "./ChatPlaceMessages";
import TextareaAutosize from "react-textarea-autosize";

const ChatPlace = props => {

    const { select, setSelect } = props;
    const [loading, setLoading] = React.useState(false);
    const [room, setRoom] = React.useState({});
    const [error, setError] = React.useState(null);
    const [messages, setMessages] = React.useState(null);
    const [changeMessage, setChangeMessage] = React.useState(null);

    const [message, setMessage] = React.useState("");

    const clickTextArea = React.useCallback(e => {

        if (e.ctrlKey && e.keyCode === 13) {
            setMessage(p => (p + "\n"));
        } else if (e.keyCode === 13) {
            e.preventDefault();
            sendMessage(e.target.value);
        }

    }, []);

    const sendMessage = React.useCallback(message => {

        if (String(message).trim().length === 0) return;

        setMessage("");

        const formdata = {
            micro_id: Date.now(),
            message,
            my: true,
            chat_id: select?.id,
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

    }, [select]);

    React.useEffect(() => {

        if (select?.id) {

            setLoading(true);
            setRoom(select);

            axios.post('users/chat/room', { id: select.id })
                .then(({ data }) => {
                    setMessages(data.messages);
                }).catch(e => {
                    setError(axios.getError(e));
                }).then(() => {
                    setLoading(false);
                });

        }

        return () => {
            setRoom({});
            setError(null);
            setMessages(null);
            setMessage("");
            setChangeMessage(null);
        }

    }, [select]);

    return <div className="chat-content d-flex flex-column">

        {room?.id && <>

            <div className="room-header d-flex">

                <div className="d-flex align-items-center flex-grow-1">

                    {room?.pin && <Label
                        size="mini"
                        className="mr-2"
                        content={room.pin}
                        color="green"
                        title="Персональный идентификационный номер"
                    />}

                    <b>{room.name}</b>

                </div>

                <div>
                    <Icon
                        name="close"
                        link
                        onClick={() => setSelect(null)}
                        size="large"
                    />
                </div>

            </div>

            <div className="romm-messages h-100 d-flex flex-column-reverse position-relative">

                {!loading && error && <Message
                    error
                    size="mini"
                    content={error}
                    className="mx-3 my-2 py-2"
                />}

                {messages && <ChatPlaceMessages data={messages} changeMessage={changeMessage} />}

                {loading && <Loader
                    inline="centered"
                    active
                    className="my-2"
                />}

            </div>

            <div className="pt-2">

                <TextareaAutosize
                    autoFocus
                    className="chat-message-textarea"
                    placeholder="Введите текст сообщения..."
                    disabled={Boolean(error)}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    maxRows={10}
                    onKeyDown={clickTextArea}
                />

            </div>

        </>}

    </div>
}

export default ChatPlace;