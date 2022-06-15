import React from "react";
import { axios } from "../../../system";
import moment from "moment";
// import RoomSearch from "./RoomSearch";
import { Image, Label, Icon, Loader } from "semantic-ui-react";

export const Rooms = props => {

    const { rooms, dropFindList, setDropFindList } = props;

    const timeout = React.useRef();
    const [search, setSearch] = React.useState(null);
    const [start, setStart] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [searched, setSearched] = React.useState([]);

    React.useEffect(() => {

        if (search !== null) {

            timeout.current && clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setStart(true), 300);

        }

    }, [search]);

    React.useEffect(() => {

        if (start && search !== null && search.length > 0) {

            setLoading(true);

            axios.post('chat/searchRoom', { search }).then(({ data }) => {
                setSearched(data.rooms);
            }).catch(e => {

            }).then(() => {
                setLoading(false);
            });

        }

        return () => setStart(false);

    }, [start]);

    React.useEffect(() => {
        if (dropFindList) {
            setStart(true);
            setDropFindList(null);
        }
    }, [dropFindList]);

    return <div className="chat-rooms">

        <div>
            <h1 className="rooms-title">Это чат 💬</h1>
        </div>

        <div className="search-content">

            <input
                className="search-input"
                placeholder="Поиск сотрудника..."
                value={search || ""}
                onChange={e => setSearch(e.target.value)}
                onKeyUp={e => e.keyCode === 13 ? setStart(true) : null}
            />

            <span className="search-button">
                {/* {!loading && <Icon
                    name="search"
                    link={search !== null && search.length > 0}
                    fitted
                    disabled={search !== null && search.length === 0}
                    onClick={(search !== null && search.length > 0) ? () => setStart(true) : null}
                />} */}
                {!loading && search !== null && search.length > 0 && <Icon
                    name="times"
                    link
                    fitted
                    onClick={() => setSearch("")}
                />}
                {loading && <Loader inverted active inline size="tiny" />}
            </span>

        </div>

        <div className="rooms-rows-content">

            {search !== null && search.length > 0 && <div>

                <div className="row-room-menu">Общий поиск</div>

                {loading && searched && searched.length === 0 && <div className="message-search-info">
                    <small>Загрузка...</small>
                </div>}

                {!loading && searched && searched.length === 0 && <div className="message-search-info">
                    <small>Ничего не найдено...</small>
                </div>}

                {searched && searched.length > 0 && searched.map((room, i) => <RoomRow
                    key={`${room.user_id}_${i}`}
                    room={{ ...room, search: false }}
                    setRoom={props.setRoom}
                    online={props.users && props.users.indexOf(room.user_id) >= 0}
                />)}

                {rooms && rooms.length > 0 && <div className="row-room-menu">Мои чаты</div>}

            </div>}

            {rooms.map(room => <RoomRow
                key={room.id}
                room={{ ...room, selected: props.selected }}
                setRoom={props.setRoom}
                online={props.users && props.users.indexOf(room.user_id) >= 0}
            />)}

        </div>

    </div>;

}

export const getFormatTime = datetime => {
    let date = moment(datetime).format("DD.MM.YYYY"),
        today = moment(new Date()).format("DD.MM.YYYY");

    if (date === today)
        return moment(datetime).format("HH:mm");

    return date;
}

const ShortMessage = props => {

    const { message } = props;

    if (!message.message && typeof message.body == "object" && message.body.length > 0) {
        message.message = message.body[0]?.name;
    }

    return <div className="room-short-message" title={message.message}>
        {message.type === "files" && <Icon name="file" title="Сообщение с файлом" />}
        {message.message || <i>Пустое сообщение...</i>}
    </div>
}

export const RoomRow = React.memo(props => {

    const { room, setRoom, online } = props;
    const className = ["room-row"];

    const avatarNull = React.useRef();
    const avatarText = React.useRef();

    if (room.id === room.selected)
        className.push('room-row-selected');

    React.useEffect(() => {

        if (!room.avatar) {
            let currentWidth = avatarNull.current.offsetWidth;
            let availableWidth = avatarText.current.offsetWidth + 40;
            let scale = currentWidth / availableWidth;

            avatarText.current.style.transform = `scale(${scale}, 1)`;
        }

    }, [room.avatar])

    return <div className={className.join(' ')} onClick={() => setRoom({ ...room })}>

        <div className="room-avatar">
            {room.avatar
                ? <Image avatar src={`${room.avatar}`} />
                : <div className="room-null-avatar" ref={avatarNull}>
                    <h2 ref={avatarText}>{room.pin}</h2>
                </div>
            }
            {online && <Label circular color="green" empty className="online-room" />}
        </div>


        <div className="room-data">
            <div className="room-title">

                <div className="room-title-parent">
                    <div className="room-title-name" title={room.name}>{room.name}</div>
                    {room.count > 0 && <Label content={room.count} color="red" size="mini" className="label-count-new-messages" />}
                </div>

                {room.message?.created_at
                    ? <div className="room-last-message">
                        <ShortMessage message={room.message} />
                        <small className="room-short-message-time">{getFormatTime(room.message.created_at)}</small>
                    </div>
                    : <div className="room-last-message info-color">
                        <div className="room-short-message">Нажмите, чтобы начать</div>
                    </div>
                }
            </div>
        </div>

    </div>;

});

export default Rooms;