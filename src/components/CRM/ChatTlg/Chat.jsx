import React from "react";
import { axios } from "./../../system";
import { connectEcho } from "./../../system/io-client";
import { Dimmer, Loader } from "semantic-ui-react";

import Rooms from "./Rooms";
import ChatPlace from "./ChatPlace";

import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import "./chat.css";

export const sort = (array, key) => {
    array.sort(function (a, b) {
        if (a[key] < b[key]) return 1;
        if (a[key] > b[key]) return -1;
        return 0;
    });
    return array;
}

export const Message = props => {

    let className = ["message-alert"];

    if (props.error)
        className.push("error");

    if (props.info)
        className.push("info");

    return <div className={className.join(' ')}>{props.content || props.children}</div>
}

export default (() => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rooms, setRooms] = React.useState([]);
    const [room, setRoom] = React.useState(null);
    const [messages, setMessages] = React.useState([]);

    const [userId, setUserId] = React.useState(null);
    const [users, setUsers] = React.useState([]);
    const [dropFindList, setDropFindList] = React.useState(null);

    const incomingMessage = data => {

        if (data.message && room?.id === data.message.chat_id) {
            setMessages(prev => {

                let finded = null;

                prev.find((item, key, list) => {
                    if (item.id === data.message.id) {
                        finded = [...list];
                        finded[key] = data.message;
                        return true;
                    }
                });

                return finded ? finded : [data.message, ...prev]
            });
        }

        if (data.room) {
            updateRoom(data.room);
        }

    }

    const updateMessage = message => {

        setMessages(prev => {
            prev.forEach((row, key) => {

                if (row.uuid && row.uuid === message.uuid) {
                    prev[key] = {
                        ...prev[key],
                        loading: message.loading,
                        failed_at: message.failed_at,
                    }
                }

            });

            return [...prev];
        });

    }

    const updateRoom = room => {

        setRooms(prev => {

            let rooms = [...prev],
                newRoom = true;

            if (!room.name) {
                room.members.forEach(member => {

                    if (member.id === userId) {

                        if (member.count)
                            room.count = member.count;

                    }
                    else if (member.id !== userId) {

                        room.name = member.name;
                        room.user_id = member.id;
                        room.pin = member.pin;

                        room.last_show = member.last_show;

                    }
                });
            }

            rooms.forEach((row, key) => {

                if (row.id === room.id) {
                    rooms[key] = room;
                    newRoom = false;
                }

            });

            if (newRoom)
                rooms.unshift(room);

            return sort(rooms, 'sort');

        });

    }

    React.useEffect(() => {

        axios.post("chat/startChat").then(({ data }) => {

            setRooms(data.rooms);
            setUserId(data.userId);

            if (!window.Echo) {
                connectEcho();

                window.Echo && window.Echo.join(`Chat`)
                    .here(data => {
                        let usrs = [];
                        data.forEach(row => {
                            usrs.push(row.id);
                        });
                        setUsers(usrs);
                    })
                    .joining(data => setUsers(prev => [...prev, data.id]))
                    .leaving(data => setUsers(prev => {
                        let index = prev.indexOf(data.id);
                        if (index >= 0)
                            prev.splice(index, 1);
                        return [...prev];
                    }));

            }

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

        return () => {
            window.Echo && window.Echo.leave(`Chat`);
        }

    }, []);

    React.useEffect(() => {

        userId && window.Echo && window.Echo.private(`Chat.Room.${userId}`)
            .listen('Chat\\NewMessage', incomingMessage)
            .listen('Chat\\UpdateMessage', incomingMessage);

        return () => {
            userId && window.Echo && window.Echo.leave(`Chat.Room.${userId}`);
        }

    }, [room, userId])

    if (loading) {
        return <Dimmer active inverted>
            <Loader inline="centered" active />
        </Dimmer>
    }

    return <div className="chat-root">

        {!error && <Rooms
            rooms={rooms}
            setRooms={setRooms}
            setRoom={setRoom}
            selected={room?.id}
            users={users}
            dropFindList={dropFindList}
            setDropFindList={setDropFindList}
        />}

        {!error && <div className="chat-body">
            {room
                ? <ChatPlace
                    userId={userId}
                    room={room}
                    setRoom={setRoom}
                    messages={messages}
                    setMessages={setMessages}
                    updateMessage={updateMessage}
                    updateRoom={updateRoom}
                    setDropFindList={setDropFindList}
                />
                : <div className="centered">
                    <Message info content="Выберите, кому хотите написать" />
                </div>
            }
        </div>}

        <div className="empty-body">
            {error && <div className="centered">
                <Message error content={error} style={{ maxWidth: 700, margin: "1rem auto" }} />
            </div>}
        </div>

    </div>;

});