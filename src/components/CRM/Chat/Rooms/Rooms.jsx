import React from "react";
import RoomRow from "./RoomRow";
import RoomSearch from "./RoomSearch";

export const Rooms = props => {

    const { room, setRoom } = props;
    const { rooms, setRooms } = props;
    const [isSearch, setIsSearch] = React.useState(false);

    return <div className="chat-users">

        <RoomSearch
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            myRooms={rooms}
            roomId={room?.id}
            setRoom={setRoom}
        />

        {isSearch === false && rooms.map(row => <RoomRow
            key={row.id}
            row={row}
            setRoom={setRoom}
            selected={room?.id === row.id}
        />)}

    </div>
}

export default Rooms;