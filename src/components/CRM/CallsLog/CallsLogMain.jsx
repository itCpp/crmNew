import React from "react";
import { Icon, Loader, Message } from "semantic-ui-react";
import { axios } from "../../../utils";
import moment from "moment";

const CallsLogMain = props => {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [rows, setRows] = React.useState([]);

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

            window.Echo && window.Echo.private(`App.Crm.Calls.Log`)
                .listen('CallsLogEvent', callsLogEvent);

        }).catch(e => {
            setError(axios.getError(e));
        }).then(() => {
            setLoading(false);
        });

        return () => {
            window.Echo && window.Echo.leave(`App.Crm.Calls.Log`);
        }

    }, []);

    React.useEffect(() => {

        getCallsLog();

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
        />)}

    </div>
}

const CallsLogRow = props => {

    const { row } = props;

    return <div className="block-card mb-2 px-3 py-2">

        <div className="d-flex align-items-center">

            <div className="mr-3">
                <Icon
                    name={row.type === "out" ? "arrow right" : "arrow left"}
                    color={row.duration > 0 ? "green" : "red"}
                />
            </div>

            <div className="flex-grow-1 d-flex justify-content-start align-items-center">

                <div>{row.caller}</div>
                <div className="mx-2">
                    <Icon
                        name="angle double right"
                        fitted
                        disabled
                    />
                </div>
                <div>{row.phone}</div>

            </div>

            <div className="d-flex align-items-center"></div>

            <div className="ml-3 opacity-60">
                {moment(row.call_at).format("DD.MM.YYYY в HH:mm")}
            </div>

        </div>

    </div>
}

export default CallsLogMain;