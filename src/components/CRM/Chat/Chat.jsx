import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import "./chat.css";
import ChatPlace from "./ChatPlace";
import ChatRooms from "./Rooms";
import { useSelector } from "react-redux";

export const sortRooms = rows => {

    let s = rows.sort((a, b) => new Date(b.message_at) - new Date(a.message_at));
    console.log(s);
    return s;
}

const Chat = () => {

    const { userData } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, serError] = React.useState(null);

    const [room, setRoom] = React.useState(null);
    const [rooms, setRooms] = React.useState([]);
    const [messages, setMessages] = React.useState([]);

    const newMessage = React.useCallback(data => {

        setRooms(p => {

            const rows = [...p];
            let push = true;

            rows.forEach((row, i) => {
                if (row.id === data.room?.id) {
                    push = false;
                    rows[i].message_at = data.room.message_at;
                }
            });

            if (data.room && push) {

                const row = { ...data.room }

                if (data.room.is_private) {
                    // userData
                }

                rows.push(row);
            }

            return sortRooms(rows);
        });

        setMessages(p => {

            console.log(p);

            return p;

            const rows = [...p];
            let push = !Boolean(rows.find(i => i.id === data.message?.id));

            if (push) {
                rows.push(data.message);
            }

            console.log(push, rows);

            return rows;
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
                selectRoom={room}
                setSelectRoom={setRoom}
                setRooms={setRooms}
                messages={messages}
                setMessages={setMessages}
            />

        </>}

    </div>
}

export default Chat;