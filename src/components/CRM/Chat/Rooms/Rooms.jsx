import React from "react";
import RoomRow from "./RoomRow";
import RoomSearch from "./RoomSearch";
import { useSelector } from "react-redux";

export const Rooms = props => {

    const online = useSelector(store => store.main.onlineId);
    const { chatOnline } = props;

    const { room, setRoom, roomString, setRoomString } = props;
    const { rooms, setRooms } = props;
    const [isSearch, setIsSearch] = React.useState(false);

    return <div className="chat-users">

        <RoomSearch
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            myRooms={rooms}
            roomId={room?.id}
            searchId={roomString}
            setRoomString={setRoomString}
            setRoom={setRoom}
            online={online}
            chatOnline={chatOnline}
        />

        {isSearch === false && <div className="chat-users-rows">

            {rooms.map(row => <RoomRow
                key={row.id}
                row={row}
                setRoom={setRoom}
                selected={room?.id === row.id}
                online={online.indexOf(row.user_id) >= 0}
                chatOnline={chatOnline.indexOf(row.user_id) >= 0}
            />)}

            {rooms.length === 0 && <div className="text-center my-3">
                <small className="opacity-50">Ещё нет чатов</small>
            </div>}

        </div>}

    </div>
}

export default Rooms;