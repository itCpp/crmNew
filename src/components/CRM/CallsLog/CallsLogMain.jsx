import React from "react";
import { Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import CallsLogRow from "./CallsLogRow";

const CallsLogMain = props => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const [hidePhone, setHidePhone] = React.useState(true);

    const callsLogEvent = React.useCallback(data => {

        setRows(prev => {

            let rows = [...prev];

            rows.unshift({ ...data, checkHidePhone: true });
            rows.splice(rows.length - 1, 1);

            return rows;
        });

    }, []);

    const getCallsLog = React.useCallback(formdata => {

        setLoading(true);

        axios.post('calls/log', formdata || {}).then(({ data }) => {

            setRows(data.rows);
            setHidePhone(data.hidePhone);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
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

    return <div className="pb-3 px-2 w-100" id="calls-log-root" style={{ maxWidth: "800px" }}>

        <div className="d-flex justify-content-between align-items-center">
            <div className="page-title-box">
                <h4 className="page-title">Журнал вызовов</h4>
            </div>
        </div>

        {loading && <Loader inline="centered" active />}

        {!loading && error && <Message error content={error} className="m-0" />}

        {!loading && !error && rows.length === 0 && <Message
            info
            content="Данных еще нет"
            className="m-0"
        />}

        {!loading && !error && rows.map((row, i) => <CallsLogRow
            key={`${row.id}_${i}`}
            row={row}
            hidePhone={hidePhone}
            setRows={setRows}
        />)}

    </div>
}

export default CallsLogMain;