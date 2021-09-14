import { Icon } from "semantic-ui-react";

function StatusZeronigInfoCell(props) {

    const { zeroing, data } = props;

    if (zeroing === 0)
        return <Icon name="times circle outline" style={{ opacity: ".5" }} title="Обнуление не настроено" />;

    if (data.algorithm === "xHour") {
        return <div className="d-flex justify-content-center align-items-center">
            <span><Icon name="clock outline" color="green" /></span>
            <span>Через <code>n</code> часов: <b>{data.algorithm_option}</b></span>
        </div>
    }

    if (data.algorithm === "nextDay") {
        return <div className="d-flex justify-content-center align-items-center">
            <span><Icon name="calendar check outline" color="green" /></span>
            <span>На следующий день</span>
        </div>
    }

    if (data.algorithm === "xDays") {
        return <div className="d-flex justify-content-center align-items-center">
            <span><Icon name="calendar alternate outline" color="green" /></span>
            <span>Через <code>n</code> дней: <b>{data.algorithm_option}</b></span>
        </div>
    }

    return <div className="d-flex justify-content-center align-items-center">
        <span><Icon name="check" color="green" /></span>
        <span>{data.algorithm}</span>
    </div>

}

export default StatusZeronigInfoCell;
