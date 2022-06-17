import { Avatar } from "antd";
import { Label } from "semantic-ui-react";
import { useSelector } from "react-redux";

export const RoomRow = props => {

    const { row, selected, setRoom, setRoomString } = props;
    const { online, chatOnline } = props;
    const { userData } = useSelector(state => state.main);
    const className = ["py-2 px-3 d-flex align-items-center chat-user-row"];

    if (selected === true)
        className.push("chat-user-row-active");

    return <div className={className.join(' ')} onClick={() => {
        setRoom(row);
        Boolean(row.fromSearch) && setRoomString(null);
    }}>

        <div className="position-relative">
            <Avatar
                src={row.image}
                title={row.name}
                children={row.pin}
                className="mr-2"
                style={{ background: (userData.id === row.user_id) ? "#f2711c" : (online ? "#b5cc18" : "silver") }}
            />

            {chatOnline && <Label
                size="mini"
                circular
                empty
                color="green"
                style={{
                    position: "absolute",
                    right: 5,
                    bottom: -1,
                }}
            />}
        </div>

        <div className="d-flex flex-grow-1 align-items-center">

            <div className="d-flex flex-column w-100">

                <div className="room-short">
                    <b>{row.name}</b>
                </div>

                {Boolean(row.toSearch) === false && <div className="d-flex align-items-center w-100">

                    <div className="room-short flex-grow-1">
                        <i>{row?.message?.message || "Сообщений ещё нет"}</i>
                    </div>

                    {Number(row.count) > 0 && <Label
                        size="mini"
                        content={row.count}
                        color="red"
                        circular
                    />}

                </div>}

            </div>

        </div>

    </div>
}

export default RoomRow;