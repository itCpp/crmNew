import { axios } from "../../../utils";
import React from "react";
import { Icon, Label, Loader, Message } from "semantic-ui-react";
import { ChatPlaceMessages, SendMessage } from "./Messages";

const ChatPlace = props => {

    const { selectRoom, setSelectRoom } = props;
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    const [room, setRoom] = React.useState({});
    const [messages, setMessages] = React.useState(null);
    const [changeMessage, setChangeMessage] = React.useState(null);

    React.useEffect(() => {

        if (selectRoom?.id) {

            setLoading(true);
            setRoom(selectRoom);

            axios.post('users/chat/room', { ...selectRoom })
                .then(({ data }) => {
                    setMessages(data.messages);
                    setRoom(data.room);
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
            setChangeMessage(null);
        }

    }, [selectRoom]);

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
                        onClick={() => setSelectRoom(null)}
                        size="large"
                    />
                </div>

            </div>

            <div className="romm-messages h-100 d-flex flex-column-reverse position-relative">

                {!loading && error && <Message
                    error
                    size="mini"
                    content={error}
                    className="chat-message-ui text-center mx-auto my-2"
                />}

                {messages && <ChatPlaceMessages
                    data={messages}
                    changeMessage={changeMessage}
                />}

                {loading && <Loader
                    inline="centered"
                    active
                    className="my-2"
                />}

            </div>

            <SendMessage
                room={room}
                chatId={room.id}
                userId={room.user_id}
                disabled={Boolean(error)}
                setChangeMessage={setChangeMessage}
            />

        </>}

    </div>
}

export default ChatPlace;