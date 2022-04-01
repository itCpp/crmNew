import React from "react";
import { withRouter } from "react-router-dom";
import { Header, Loader } from "semantic-ui-react";
import { axios } from "../../../utils";
import RatingInChartsRow from "./RatingInChartsRow";
import "../rating.css";

const RatingInCharts = props => {

    const interval = React.useRef();

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [users, setUsers] = React.useState([]);

    const getData = React.useCallback((param = {}) => {

        setLoad(true);

        axios.post('ratings/callcenter', {
            toPeriod: true,
        }).then(({ data }) => {
            setUsers(data.users);
        }).catch(e => {

        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {

        getData(true);
        interval.current = setInterval(() => getData(), 15000);

        return () => {
            clearInterval(interval.current);
        }

    }, [props.location.key]);

    return <div id="rating" className="p-2 w-100">

        <div className="rating-callcenter-row w-100">
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="m-0 flex-grow-1">Рейтинг</h2>
            </div>
        </div>

        {loading && <Loader active inline="centered" className="mt-4" />}
        {!loading && load && <div
            style={{
                position: "fixed",
                bottom: ".5rem",
                right: ".5rem",
                zIndex: 100,
            }}
            children={<Loader active inline />}
        />}

        {users.map(row => <RatingInChartsRow
            key={row.pin}
            row={row}
        />)}

    </div>
}

export default withRouter(RatingInCharts);