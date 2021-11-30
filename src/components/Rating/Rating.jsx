import React from "react";
import axios from "./../../utils/axios-header";
import { Loader, Message } from "semantic-ui-react";
import "./rating.css";

import RatingUserRow from "./RatingUserRow";

const Rating = () => {

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [users, setUsers] = React.useState([]);

    const getData = (clear = false) => {

        setLoad(true);
        clear && setLoading(true);
        clear && setError(null);

        axios.post('ratings/callcenter', {
            start: "2021-11-16",
        }).then(({ data }) => {

            error && setError(null);
            setUsers(data.users);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    React.useEffect(() => {
        getData(true);
    }, []);

    return <div>

        {loading && <Loader inline="centered" active />}

        {!loading && load && <div style={{
            position: "fixed",
            bottom: 10,
            right: 10
        }}>
            <Loader inline active />
        </div>}

        {!loading && error && <Message error content={error} />}

        {!loading && users.map(row => <RatingUserRow key={row.pin} row={row} />)}

    </div>

}

export default Rating;