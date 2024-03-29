import React from "react";
import { withRouter } from "react-router-dom";
import axios from "./../../utils/axios-header";
import { Loader, Message } from "semantic-ui-react";
import "./rating.css";

import CrmStat from "./CrmStat";
import RatingUserRow from "./RatingUserRow";
import RatingHeader from "./RatingHeader";
import RatingCharts from "./Charts";

const Rating = withRouter(props => {

    const [started, setStarted] = React.useState(false);
    const [startedError, setStartedError] = React.useState(null);
    const [startedData, setStartedData] = React.useState({});

    const [loading, setLoading] = React.useState(true);
    const [load, setLoad] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [period, setPeriod] = React.useState({ toPeriod: true });
    const [dates, setDates] = React.useState({});

    const [users, setUsers] = React.useState([]);
    const [charts, setCharts] = React.useState({});
    const [crmStat, setCrmStat] = React.useState(null);

    const interval = React.useRef();

    const getData = (clear = false) => {

        setLoad(true);
        clear && setLoading(true);
        clear && setError(null);

        axios.post('ratings/callcenter', {
            toPeriod: period && period.toPeriod,
            start: period && period.start || null,
            stop: period && period.stop || null,
            callcenter: period?.callcenter,
        }).then(({ data }) => {

            error && setError(null);
            setUsers(data.users);
            data.crm && setCrmStat(data.crm);
            setDates(data.dates);
            setCharts(data.charts || {});

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });
    }

    React.useEffect(() => {
        axios.post('ratings/callcenter/start').then(({ data }) => {
            setStarted(true);
            setPeriod(p => ({ ...p, callcenter: data.callcenter || null }));
            setStartedData(data);
        }).catch(e => {
            setStartedError(axios.getError(e));
        });
    }, []);

    React.useEffect(() => {

        if (started === false) return;

        getData(true);
        interval.current = setInterval(() => getData(), 15000);

        return () => {
            clearInterval(interval.current);
        }

    }, [props.location.key, period]);

    return <div id="rating">

        <RatingHeader
            started={started}
            startedError={startedError}
            startedData={startedData}
            loading={loading}
            period={period}
            setPeriod={setPeriod}
            dates={dates}
            getData={getData}
        />

        {startedError && <Message error content={startedError} />}

        {started && !startedError && <>

            {loading && <Loader inline="centered" />}

            {!loading && load && <div style={{
                position: "fixed",
                bottom: 10,
                right: 10,
                zIndex: 10,
            }}>
                <Loader inline active />
            </div>}

            {!loading && error && <Message error content={error} />}

            {!loading && crmStat && <CrmStat data={crmStat} />}

            {!loading && charts && <RatingCharts data={charts} />}

            {!loading && users.map(row => <RatingUserRow key={row.pin} row={row} />)}

        </>}

    </div>

});

export default Rating;