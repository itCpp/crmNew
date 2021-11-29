import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label, Button } from "semantic-ui-react";
import DatePicker from "./../../../../utils/DatePicker";
import moment from "./../../../../utils/moment";

import RequestsSearch from "./../RequestsSearch";
import RequestAdd from "./RequestAdd";
import RequestAddPhone from "./RequestAddPhone";

const ChangeData = props => {

    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const { setPeriod, loading } = props;

    React.useEffect(() => {

        if (startDate || endDate) {
            setPeriod([
                startDate ? moment(startDate).format("YYYY-MM-DD") : null,
                endDate ? moment(endDate).format("YYYY-MM-DD") : null
            ]);
        }

    }, [startDate, endDate]);

    const ButtonDatePicker = React.forwardRef((props, ref) => {
        const { value, onClick } = props;
        return <Button
            onClick={onClick}
            ref={ref}
            color={value ? "green" : null}
            size="tiny"
            icon={value ? null : <Icon name="calendar plus" fitted />}
            content={value}
            style={{ borderRadius: (startDate || endDate) ? 0 : ".25rem" }}
            className={(startDate || endDate) ? "px-2" : "px-3"}
            disabled={loading}
            basic={(startDate || endDate) ? false : true}
        />
    });

    return (
        <Button.Group className="btn-group-datepicker" title="Выберите период">
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                customInput={<ButtonDatePicker />}
                dateFormat="dd.MM.yyyy"
                children={<div className="text-center text-warning">Выберите дату начала</div>}
                popperPlacement="top-end"
            />
            {startDate && <>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    customInput={<ButtonDatePicker />}
                    dateFormat="dd.MM.yyyy"
                    children={<div className="text-center text-warning">Выберите дату окончания</div>}
                    popperPlacement="top-end"
                />
                <Button
                    color="facebook"
                    icon={<Icon name="delete calendar" fitted />}
                    style={{ borderRadius: 0 }}
                    title="Очистить даты"
                    className="px-2"
                    onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                        setPeriod([null, null]);
                    }}
                    disabled={loading}
                />
                {/* <Button
                    color="green"
                    icon={<Icon name="calendar check" fitted />}
                    style={{ borderRadius: 0 }}
                    title="Применить период"
                    className="px-2"
                    disabled={loading}
                /> */}
            </>}
        </Button.Group>
    );
}

const RequestsTitle = React.memo(props => {

    const { select, tabs, counter } = useSelector(state => state.requests);
    const [add, setAdd] = React.useState(false);

    const tab = tabs.find(item => item.id === select);
    const count = tab && counter && counter[`tab${tab.id}`];

    return <div className="d-flex justify-content-between align-items-center" style={{ zIndex: 1000 }}>

        <RequestAddPhone />

        <div className="page-title-box">

            <h4 className="page-title">Заявки</h4>

            {tab?.name &&
                <div className="page-title-subox">
                    <Icon name="chevron right" />
                    <span>{tab.name}</span>
                    {count && count.count > 0 && <Label
                        content={count.count}
                        size="mini"
                        color="green"
                    />}
                </div>
            }

            {select === 0 &&
                <div className="page-title-subox">
                    <Icon name="chevron right" />
                    <span>Поиск заявок</span>
                </div>
            }

        </div>

        <div className="d-flex align-items-center">

            <div className="mr-2">
                <ChangeData
                    setPeriod={props.setPeriod}
                    loading={props.loading}
                />
            </div>

            {window?.requestPermits?.requests_add && <>
                <Button
                    icon="plus"
                    color="green"
                    circular
                    title="Создать заявку"
                    basic
                    onClick={() => setAdd(true)}
                />
                {add && <RequestAdd setOpen={setAdd} />}
            </>}

            <RequestsSearch {...props} />
        </div>

    </div>

});

export default RequestsTitle;