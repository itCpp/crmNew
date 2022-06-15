import { Avatar } from "antd";
import { Label } from "semantic-ui-react";

export const RoomRow = props => {

    const { online, row, selected, setRoom } = props;
    const className = ["py-2 px-3 d-flex align-items-center chat-user-row"];

    if (selected === true)
        className.push("chat-user-row-active");

    return <div className={className.join(' ')} onClick={() => setRoom(row)}>

        <div>
            <Avatar
                src={row.image}
                title={row.name}
                children={row.pin}
                className="mr-2"
                style={{ background: online ? "green" : "silver" }}
            />
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