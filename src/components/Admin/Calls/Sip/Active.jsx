import React from "react";
import axios from "./../../../../utils/axios-header";
import { Loader } from "semantic-ui-react";
import ActiveRow from "./ActiveRow";
import moment from "moment";

const ActiveSip = props => {

    const [load, setLoad] = React.useState(true);
    const [rows, setRows] = React.useState([]);
    const [dates, setDates] = React.useState({});
    const [period, setPeriod] = React.useState({});

    const interval = React.createRef();

    const loadData = () => {

        axios.post('admin/sip/stats', dates).then(({ data }) => {
            setRows(prev => {

                data.events.forEach(row => {

                    let finded = false;

                    prev.find((item, key) => {
                        if (item.extension === row.extension) {
                            prev[key] = {
                                ...prev[key],
                                event: [...item.events, ...row.events],
                                status: row.status,
                                eventLast: row.eventLast,
                            }
                            finded = true;
                        }
                    });

                    if (!finded)
                        prev.push(row);

                });

                return prev;
            });

            setDates({
                start: data.first,
                stop: data.last,
            });

            setPeriod(data.period);

        }).then(() => {
            setLoad(false);
        });

    }

    React.useEffect(() => {
        axios.post('admin/sip/stats').then(({ data }) => {
            setRows(data.events);
            setDates({
                start: data.first,
                last: data.last,
                stop: data.stop,
            });
            setPeriod(data.period);
        }).then(() => {
            setLoad(false);
        });
    }, []);

    React.useEffect(() => {

        interval.current = setInterval(loadData, 5000);

        return () => {
            clearInterval(interval.current);
        }

    }, [dates]);

    return <div className="admin-content-segment d-flex flex-column">

        {dates.start &&
            <div className="d-flex justify-content-between mb-3">
                <div>{moment(dates.start).format("DD.MM.YYYY HH:mm")}</div>
                <div>{moment(dates.stop).format("DD.MM.YYYY HH:mm")}</div>
            </div>
        }

        {rows.map(row => <ActiveRow key={row.extension} row={row} period={period} />)}

        {load && <Loader inline="centered" active />}

    </div>
}

export default ActiveSip;