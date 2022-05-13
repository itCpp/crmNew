import React from "react";
import { Header } from "semantic-ui-react";
import moment from "../../utils/moment";

const Clock = () => {

    const [date, setDate] = React.useState(null);
    const [step, setStep] = React.useState(true);
    const interval = React.useRef();

    const tik = React.useCallback(() => {

        let today = new Date();
        let localoffset = -(today.getTimezoneOffset() / 60),
            destoffset = 3;

        let offset = destoffset - localoffset;
        let d = new Date().getTime() + offset * 3600 * 1000;
        let date = new Date(d);

        // setStep(p => {
        //     setDate(moment(date).format("HH:mm:ss"));
        //     return !p;
        // });

        setDate(moment(date).format("HH:mm:ss"));

    }, []);

    React.useEffect(() => {

        tik();

        interval.current = setInterval(tik, 1000);

        return () => {
            interval.current && clearInterval(interval.current);
        }

    }, []);

    return <div>
        <Header
            content={date}
            className="mt-1 ml-2"
        />
    </div>
}

export default Clock;