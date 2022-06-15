import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import "./chat.css";
import ChatPlace from "./ChatPlace";
import ChatRooms from "./Rooms";
import { useSelector } from "react-redux";

const Chat = () => {

    const { userData } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, serError] = React.useState(null);

    const [room, setRoom] = React.useState(null);
    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {

        axios.post('users/chat').then(({ data }) => {

            setRooms(data.rooms);

            window.Echo && window.Echo.join("Chat");

            window.Echo && window.Echo.private(`Chat.Room.${userData.id}`)
                .listen('NewMessage', console.log);

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
            />

            <ChatPlace
                select={room}
                setSelect={setRoom}
                setRooms={setRooms}
            />

        </>}

    </div>
}

export default Chat;