import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import "./chat.css";
import ChatPlace from "./ChatPlace";
import ChatRooms from "./Rooms";
import { useSelector } from "react-redux";
import { useSetRooms } from "./index";
import useSetMessages from "./useSetMessages";

const Chat = () => {

    const { userData } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, serError] = React.useState(null);

    const [room, setRoom] = React.useState(null);
    const [roomString, setRoomString] = React.useState(null);
    const [rooms, setRooms] = React.useState([]);
    const [placeData, setPlaceData] = React.useState(null);
    const { pushMessage } = useSetMessages({ placeData, setPlaceData });
    const [online, setOnline] = React.useState([]);

    const { updateRooms } = useSetRooms(setRooms, userData.id);

    const newMessage = React.useCallback(data => {

        Boolean(data.room) && updateRooms(data.room);
        Boolean(data.message) && pushMessage(data.message);

    }, []);

    React.useEffect(() => {

        axios.post('users/chat').then(({ data }) => {

            setRooms(data.rooms);

            window.Echo && window.Echo.join("Chat")
                .here((users) => {
                    setOnline(users.map(user => user.id));
                })
                .joining((user) => {
                    setOnline(users => ([...users, user.id]));
                })
                .leaving((user) => {
                    setOnline(users => {
                        const online = [];
                        users.forEach(id => {
                            if (id !== user.id)
                                online.push(id);
                        })
                        return online;
                    });
                });

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
                chatOnline={online}
            />

            <ChatPlace
                selectRoom={room}
                setSelectRoom={setRoom}
                setRoomString={setRoomString}
                setRooms={setRooms}
                placeData={placeData}
                setPlaceData={setPlaceData}
                pushMessage={pushMessage}
            />

        </>}

    </div>
}

export default Chat;