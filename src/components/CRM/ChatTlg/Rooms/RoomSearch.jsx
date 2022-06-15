import React from "react";
import { Icon, Loader } from "semantic-ui-react";
import { axios } from "../../../system";
import { RoomRow } from "./Rooms";

const RoomSearch = props => {

    const { rooms, setRoom } = props;
    const input = React.useRef();
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

        if (start) {

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

    return <div>

        <div className="search-content">
            <input
                className="search-input"
                placeholder="Поиск сотрудника..."
                ref={input}
                value={search || ""}
                onChange={e => setSearch(e.target.value)}
            />
            <span className="search-button">
                {!loading && <Icon
                    name="search"
                    link={search !== null && search.length > 0}
                    fitted
                    disabled={search !== null && search.length === 0}
                    onClick={(search !== null && search.length > 0) ? () => setStart(true) : null}
                />}
                {loading && <Loader inverted active inline size="tiny" />}
            </span>
        </div>

        {search !== null && search.length > 0 && <div>

            <div className="row-room-menu">Общий поиск</div>

            {!loading && searched && searched.length === 0 && <div style={{
                textAlign: "center",
                margin: "1rem auto",
                opacity: 0.4,
            }}>
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

    </div>
}

export default RoomSearch;