import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import "./chat.css";
import ChatPlace from "./ChatPlace";
import ChatRooms from "./Rooms";
import { useSelector } from "react-redux";
import { useSetRooms } from "./index";

const Chat = () => {

    const { userData } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, serError] = React.useState(null);

    const [room, setRoom] = React.useState(null);
    const [roomString, setRoomString] = React.useState(null);
    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState({});

    const { updateRooms } = useSetRooms(setRooms, userData.id);

    const newMessage = React.useCallback(data => {

        console.log(data);

        updateRooms(data.room);

        setMessages(p => {

            const prev = { ...p };

            const messages = [...(prev?.messages || [])],
                push = !Boolean(messages.find(i => i.id === data.message?.id));

            if (push)
                messages.unshift(data.message);

            // const length = messages.length;
            // if (length > prev.limit * prev.page)
            //     messages.splice(length - 1, 1);

            prev.messages = messages;

            return prev;
        });

    }, []);

    React.useEffect(() => {

        axios.post('users/chat').then(({ data }) => {

            setRooms(data.rooms);

            window.Echo && window.Echo.join("Chat");

            window.Echo && window.Echo.private(`Chat.Room.${userData.id}`)
                .listen('Chat\\NewMessage', newMessage);

        }).catch(e => {
            serError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

        return () => {
            setLoading(true);
            serError(null);

            window.Echo && window.Echo.leave("Chat");
            window.Echo && window.Echo.leave(`Chat.Room.${userData.id}`);
        }

    }, []);

    // React.useEffect(() => setRoomString(null), [room]);

    return <div className="d-flex w-100 position-relative">

        {loading && <div
            className="position-absolute-border d-flex justify-content-center align-items-center"
            children={<Loader active />}
        />}

        {!loading && error && <div
            className="position-absolute-border d-flex justify-content-center align-items-center"
            children={<Message error size="mini" content={error} className="chat-message-ui" />}
        />}

        {!loading && !error && <>

            <ChatRooms
                rooms={rooms}
                setRooms={setRooms}
                room={room}
                setRoom={setRoom}
                roomString={roomString}
                setRoomString={setRoomString}
            />

            <ChatPlace
                selectRoom={room}
                setSelectRoom={setRoom}
                setRoomString={setRoomString}
                setRooms={setRooms}
                messages={messages}
                setMessages={setMessages}
            />

        </>}

    </div>
}

export default Chat;