import React from "react";
import { Input } from "semantic-ui-react";
import { axios } from "../../../../utils";
import RoomRow from "./RoomRow";

const RoomSearch = props => {

    const { myRooms, setIsSearch, setRoom, roomId } = props;

    const timeout = React.useRef();

    const [search, setSearch] = React.useState(false);
    const [rooms, setRooms] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);

    const find = React.useCallback(word => {

        if (loading) return;

        setLoading(true);

        axios.post('users/chat/room/search', { search: word })
            .then(({ data }) => {

                setError(false);

                const rows = [],
                    pins = [];

                myRooms.forEach(row => {
                    if (String(row.name).toLowerCase().indexOf(String(word).toLowerCase()) >= 0) {
                        rows.push(row);
                        pins.push(row.pin);
                    }
                });

                data.rows.forEach(row => {
                    if (pins.indexOf(row.pin) < 0)
                        rows.push({ ...row, toSearch: true });
                });

                setRooms(rows);

            }).catch(e => {
                setError(axios.getError(e));
            }).then(() => {
                setLoading(false);
            });
    }, [loading]);

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

        {search && rooms.map(row => <RoomRow
            key={row.id}
            row={row}
            setRoom={setRoom}
            selected={roomId === row.id}
        />)}

    </>
}

export default RoomSearch;