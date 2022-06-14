import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import "./chat.css";
import ChatPlace from "./ChatPlace";
import ChatRooms from "./ChatRooms";
import { useSelector } from "react-redux";

const Chat = () => {

    const { userData } = useSelector(state => state.main);

    const [loading, setLoading] = React.useState(true);
    const [error, serError] = React.useState(null);

    const [rooms, setRooms] = React.useState([]);
    const [select, setSelect] = React.useState(null);

    React.useEffect(() => {

        axios.post('users/chat').then(({ data }) => {

            setRooms(data.rooms);

            window.Echo && window.Echo.join("Chat");

            window.Echo && window.Echo.private(`Chat.Room.${userData.id}`);

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

    return <div className="d-flex w-100">

        {loading && <Loader inline="centered" active className="mt-3" />}

        {!loading && error && <div className="w-100 mt-3 px-3">
            <Message error content={error} style={{ maxWidth: 600 }} className="mx-auto" />
        </div>}

        {!loading && !error && <>

            <ChatRooms
                rooms={rooms}
                setRooms={setRooms}
                select={select}
                setSelect={setSelect}
            />

            <ChatPlace
                select={select}
                setSelect={setSelect}
            />

        </>}

    </div>
}

export default Chat;