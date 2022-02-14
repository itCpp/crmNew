import React from "react";
import { Dropdown, Grid, Icon } from "semantic-ui-react";
import moment from "moment";
import "./calendar.css";

const PeriodCalendar = props => {

    const { loading } = props;
    const { period, setPeriod, dates } = props;

    const date = dates.start || null;
    const [select, setSelect] = React.useState(date || moment(new Date).format("YYYY-MM-DD"));

    const [open, setOpen] = React.useState(false);

    const claendarIcon = period.toPeriod
        ? { name: "calendar alternate", title: "Периорд", color: "green" }
        : { name: "calendar check", title: "Один день", color: "blue" };

    const mmmmyyyy = moment(select).format("MMMM YYYY");

    const setDate = date => {
        setPeriod(prev => ({
            ...prev,
            toPeriod: false,
            start: date,
            stop: date,
        }));
        setOpen(false);
    }

    const close = React.useCallback(() => setOpen(false), []);

    React.useEffect(() => {
        if (open) document.addEventListener('click', close);
        else document.removeEventListener('click', close);
    }, [open]);

    return <Dropdown
        text={moment(date).format("DD.MM.YYYY")}
        floating
        labeled
        button
        icon={claendarIcon}
        className="icon mx-1"
        basic
        loading={loading}
        pointing="top"
        open={open}
        onClick={() => !open && !loading && setOpen(true)}
    >
        <Dropdown.Menu className="dropdown-center">

            <Dropdown.Header content="Выберите период или дату" />
            <Dropdown.Divider />

            <div className="calendar-content">

                <div className="mx-3 mb-3 mt-1 d-flex justify-content-between align-items-center">
                    <span>
                        <Icon
                            name="angle double left"
                            fitted
                            link
                            onClick={() => {
                                let d = new Date(select);
                                d.setMonth(d.getMonth() - 1);
                                setSelect(moment(d).format("YYYY-MM-DD"));
                            }}
                        />
                    </span>
                    <strong>{mmmmyyyy[0].toUpperCase() + mmmmyyyy.slice(1)}</strong>
                    <span>
                        <Icon
                            name="angle double right"
                            fitted
                            link
                            onClick={() => {
                                let d = new Date(select);
                                d.setMonth(d.getMonth() + 1);
                                setSelect(moment(d).format("YYYY-MM-DD"));
                            }}
                        />
                    </span>
                </div>

                <Grid columns="equal" divided>
                    <Grid.Row stretched>
                        <Grid.Column width={6}>
                            <div className={`calendar-cell ${period?.toPeriod && date === moment(select).format("YYYY-MM-01") ? 'calendar-cell-active' : ''}`} onClick={() => {
                                setOpen(false);
                                setPeriod(prev => ({
                                    ...prev,
                                    toPeriod: true,
                                    start: moment(select).format("YYYY-MM-01"),
                                    stop: null,
                                }));
                            }}>1 период</div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <CalendarDates
                                current={date}
                                date={select}
                                period={1}
                                setDate={setDate}
                                toPeriod={period?.toPeriod}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched>
                        <Grid.Column width={6}>
                            <div className={`calendar-cell ${period?.toPeriod && date === moment(select).format("YYYY-MM-16") ? 'calendar-cell-active' : ''}`} onClick={() => {
                                setOpen(false);
                                setPeriod(prev => ({
                                    ...prev,
                                    toPeriod: true,
                                    start: moment(select).format("YYYY-MM-16"),
                                    stop: null,
                                }));
                            }}>2 период</div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <CalendarDates
                                current={date}
                                date={select}
                                period={2}
                                setDate={setDate}
                                toPeriod={period?.toPeriod}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </div>

        </Dropdown.Menu>

    </Dropdown>;

}

/** Формирование дней недели периода */
const CalendarDates = props => {

    const { setDate, current, date, period, toPeriod } = props;

    const datetime = moment(date);
    const selected = !toPeriod && moment(current).format("YYYY-MM-DD");

    const year = datetime.year();
    const month = datetime.month();
    const day = datetime.date();
    const lastDay = datetime.daysInMonth();

    let start = day;
    let stop = day;

    if (period === 1) {
        start = 1;
        stop = 15;
    } else if (period === 2) {
        start = 16;
        stop = lastDay;
    }

    const rangeStart = moment({ year, month, day: start });

    const days = [];
    let w = 0;

    days[w] = [];
    let startDay = (rangeStart.day() === 0 ? 7 : rangeStart.day()) - 1;

    for (let d = 0; d < startDay; d++) {
        days[w][d] = null;
    }

    for (let i = start; i <= stop; i++) {

        if (!days[w])
            days[w] = [];

        let toDay = moment({ year, month, day: i });
        let toDayWeek = (toDay.day() === 0 ? 7 : toDay.day()) - 1;
        let format = toDay.format("YYYY-MM-DD");

        days[w][toDayWeek] = {
            date: i,
            format: format,
            day: toDayWeek,
            selected: selected === format,
        };

        if (days[w] && days[w].length >= 7)
            w++;

    }

    if (days[w] && days[w].length < 7) {
        for (let d = days[w].length; d < 7; d++) {
            days[w][d] = null;
        }
    }

    return days.map((week, i) => <div key={`${period}_${i}`} className="period-row">

        <div className="week-row">

            {week.map((row, d) => {

                let className = ["calendar-cell"];

                if (!row)
                    className.push('calendar-cell-empty');

                if (row && row.day && row.day >= 5)
                    className.push('calendar-cell-holyday');

                if (row && row.selected)
                    className.push('calendar-cell-active');

                let text = row && row.date
                    ? row.date.toString().padStart(2, '0')
                    : <>&nbsp;&nbsp;</>;

                return <div key={d} className={className.join(' ')} onClick={() => row && setDate(row.format)}>{text}</div>

            })}

        </div>

    </div>);

}

export default PeriodCalendar;