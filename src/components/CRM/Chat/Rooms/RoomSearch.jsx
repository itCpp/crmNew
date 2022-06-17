import React from "react";
import { Input } from "semantic-ui-react";
import { axios } from "../../../../utils";
import RoomRow from "./RoomRow";

const RoomSearch = props => {

    const { myRooms, setIsSearch, setRoom, roomId, searchId, setRoomString } = props;

    const timeout = React.useRef();

    const [search, setSearch] = React.useState(false);
    const [found, setFound] = React.useState([]);
    const [rooms, setRooms] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const find = React.useCallback(word => {

        if (loading) return;

        setLoading(true);

        axios.post('users/chat/room/search', { search: word })
            .then(({ data }) => {
                setError(false);
                setFound(data.rows);
            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
    }, [loading]);

    const setRoomsList = React.useCallback((rooms, found) => {

        const rows = [],
            pins = [];

        rooms.forEach(row => {
            if (String(row.name).toLowerCase().indexOf(String(search).toLowerCase()) >= 0) {
                rows.push(row);
                pins.push(row.pin);
            }
        });

        found.forEach(row => {
            if (pins.indexOf(row.pin) < 0)
                rows.push({ ...row, toSearch: true });
        });

        setRooms(rows);

    }, [search]);

    React.useEffect(() => setRoomsList(myRooms, found), [myRooms, found]);

    React.useEffect(() => {

        const isSearch = Boolean(search);

        if (isSearch) {
            timeout.current && clearTimeout(timeout.current);
            timeout.current = setTimeout(() => find(search), 300);
        } else {
            setRooms([]);
        }

        setIsSearch(isSearch);
        setError(false);

    }, [search]);

    return <>

        <div className="chat-user-search">

            <Input
                placeholder="Поиск..."
                fluid
                icon={search ? {
                    name: "close",
                    link: true,
                    onClick: () => {
                        setSearch(false);
                        setRooms([]);
                    },
                } : null}
                value={search || ""}
                onChange={(e, { value }) => setSearch(String(value).length > 0 ? value : false)}
                loading={loading}
                onKeyDown={e => {
                    if (e.keyCode !== 13) return;
                    timeout.current && clearTimeout(timeout.current);
                    find(e.target.value);
                }}
                error={Boolean(error)}
            />

        </div>

        {error && <div className="text-center p-3">
            <b className="text-danger">{error}</b>
        </div>}

        {search && <div className="chat-users-rows">

            {!loading && rooms.length === 0 && <div className="text-center my-3">
                <small className="opacity-50">Ничего не найдено</small>
            </div>}

            {rooms.map(row => <RoomRow
                key={row.id}
                row={{ ...row, fromSearch: true }}
                setRoom={setRoom}
                setRoomString={setRoomString}
                selected={roomId === row.id || searchId === row.searchId}
            />)}

        </div>}

    </>
}

export default RoomSearch;