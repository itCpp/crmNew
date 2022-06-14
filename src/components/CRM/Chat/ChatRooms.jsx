import { Avatar } from "antd";
import React from "react";
import { Label } from "semantic-ui-react";

export const ChatRooms = props => {

    const { rooms, select, setRooms } = props;

    return <div className="chat-users">

        {rooms.map(row => <RoomRow
            key={row.id}
            row={row}
            setSelect={props.setSelect}
            selected={select?.id === row.id}
        />)}

    </div>
}

export const RoomRow = props => {

    const { row, setSelect } = props;
    const className = ["py-2 px-3 d-flex align-items-center chat-user-row"];

    if (props.selected === true)
        className.push("chat-user-row-active");

    return <div className={className.join(' ')} onClick={() => setSelect(row)}>

        <div>
            <Avatar
                src={row.image}
                title={row.name}
                children={row.pin}
                className="mr-2"
            />
        </div>

        <div className="d-flex flex-grow-1 align-items-center">

            <div className="d-flex flex-column w-100">

                <div className="room-short">
                    <b>{row.name}</b>
                </div>

                <div className="d-flex align-items-center w-100">

                    <div className="room-short flex-grow-1">
                        <i>{row?.message?.message || "Сообщений ещё нет"}</i>
                    </div>

                    {Number(row.count) > 0 && <Label
                        size="mini"
                        content={row.count}
                        color="red"
                        circular
                    />}

                </div>

            </div>

        </div>

    </div>
}

export default ChatRooms;