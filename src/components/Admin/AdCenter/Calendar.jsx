import React from 'react'

import DatePicker from 'react-datepicker'
import * as ru from "date-fns/locale/ru";
import { registerLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

function Calendar(props) {

    registerLocale("ru", ru);

    const [startDate, setStartDate] = React.useState(props.dateStart);
    const [endDate, setEndDate] = React.useState(props.dateStop);

    React.useEffect(() => {
        props.setDateStart(startDate);
    }, [startDate]);

    React.useEffect(() => {
        props.setDateStop(endDate);
    }, [endDate]);

    const onChange = dates => {

        const [start, end] = dates;

        setStartDate(start);
        setEndDate(end);
        
    }

    return <div className="mb-2 text-center">
        <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            locale="ru"
            selectsRange
            inline
        />
    </div>

}

export default Calendar;