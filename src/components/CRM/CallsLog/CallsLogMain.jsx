import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import CallsLogRow from "./CallsLogRow";

const CallsLogMain = props => {

    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [hidePhone, setHidePhone] = React.useState(true);

    const [load, setLoad] = React.useState(false);
    const [stop, setStop] = React.useState(false);
    const [page, setPage] = React.useState(1);

    const callsLogEvent = React.useCallback(data => {

        setRows(prev => {

            let rows = [...prev];

            rows.unshift({ ...data, checkHidePhone: true });
            rows.splice(rows.length - 1, 1);

            return rows;
        });

    }, []);

    const getCallsLog = React.useCallback((formdata = {}) => {

        setLoad(true);

        axios.post('calls/log', formdata).then(({ data }) => {

            setRows(prev => data.current > 1 ? [...prev, ...data.rows] : [...data.rows]);
            setHidePhone(data.hidePhone);
            setPage(data.current);

            if (data.current === data.pages)
                setStop(true);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
            setLoad(false);
        });

    }, []);

    React.useEffect(() => {

        getCallsLog();

        window.Echo && window.Echo.private(`App.Crm.Calls.Log`)
            .listen('CallsLogEvent', callsLogEvent);

        return () => {
            window.Echo && window.Echo.leave(`App.Crm.Calls.Log`);
        }

    }, []);

    React.useEffect(() => {

        const scrolling = () => {

            const height = document.getElementById('root').offsetHeight;
            const screenHeight = window.innerHeight;
            const scrolled = window.scrollY;
            const threshold = height - screenHeight / 4;
            const position = scrolled + screenHeight;

            if (threshold >= position || load || stop) return;

            setLoad(true);
            getCallsLog({ page: page + 1 });
        }

        window.addEventListener('scroll', scrolling);

        return () => {
            window.removeEventListener('scroll', scrolling);
        }

    }, [load, page, stop]);

    return <div className="pb-3 px-2 w-100" id="calls-log-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Журнал вызовов</h4>
            </div>
        </div>

        {!loading && error && <Message error content={error} className="m-0" />}

        {!loading && !error && rows.length === 0 && <div className="block-card text-center mb-2">
            <span className="opacity-50">Журнал пуст</span>
        </div>}

        {!loading && !error && rows.map((row, i) => <CallsLogRow
            key={`${row.id}_${i}`}
            row={row}
            hidePhone={hidePhone}
            setRows={setRows}
        />)}

        {(loading || load) && <Loader inline="centered" active className="mt-2" />}

        {stop && <div className="text-center mb-3 opacity-50">
            <small>Это все данные</small>
        </div>}

    </div>
}

export default CallsLogMain;