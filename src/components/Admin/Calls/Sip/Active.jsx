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

                let next = [...prev];

                data.events.forEach(row => {

                    let finded = false;

                    next.find((item, key) => {
                        if (item.extension === row.extension) {
                            next[key] = {
                                ...next[key],
                                events: [...item.events, ...row.events],
                                status: row.status,
                                eventLast: row.eventLast,
                            }
                            finded = true;
                        }
                    });

                    if (!finded)
                        next.push(row);

                });

                return next;
            });

            setDates(prev => ({
                start: data.first,
                last: data.last ? data.last : prev.last,
                stop: data.stop,
            }));

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

        {!load && rows.map(row => <ActiveRow key={row.extension} row={row} period={period} />)}
        {!load && rows && rows.length === 0 && <div className="text-center my-5 opacity-50">Данных нет</div>}

        {load && <Loader inline="centered" active />}

    </div>
}

export default ActiveSip;