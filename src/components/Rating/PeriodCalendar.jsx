import React from "react";
import { Dropdown, Grid, Segment } from "semantic-ui-react";
import moment from "moment";
import "./calendar.css";

const PeriodCalendar = props => {

    const { loading } = props;
    const { period, setPeriod, dates } = props;

    const date = dates.start || null;

    const claendarIcon = period.toPeriod
        ? { name: "calendar alternate", title: "Периорд", color: "green" }
        : { name: "calendar check", title: "Один день", color: "blue" };

    return <Dropdown
        text={moment(date).format("DD.MM.YYYY")}
        floating
        labeled
        button
        icon={claendarIcon}
        className="icon mx-1"
        basic
        loading={loading}
    >
        <Dropdown.Menu>

            <Dropdown.Header content="Выберите период или дату" />
            <Dropdown.Divider />

            <div className="calendar-content">

                <Grid columns="equal" divided>
                    <Grid.Row stretched>
                        <Grid.Column width={6}>
                            <div className="calendar-cell">1 период</div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <CalendarDates
                                date={date}
                                period={1}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row stretched>
                        <Grid.Column width={6}>
                            <div className="calendar-cell">2 период</div>
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <CalendarDates
                                date={date}
                                period={2}
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

    const { date, period } = props;

    const datetime = moment(date);
    const selected = datetime.format("YYYY-MM-DD");

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

    if (days[w].length < 7) {
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

                return <div key={d} className={className.join(' ')}>{text}</div>

            })}

        </div>

    </div>);

}

export default PeriodCalendar;