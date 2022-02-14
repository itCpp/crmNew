import React from "react";
import { useSelector } from "react-redux";
import { Icon, Label, Button, Dropdown, Input } from "semantic-ui-react";
import DatePicker from "./../../../../utils/DatePicker";
import moment from "./../../../../utils/moment";
import RequestsSearch from "./../RequestsSearch";
import RequestAdd from "./RequestAdd";
import RequestAddPhone from "./RequestAddPhone";

const ChangeData = props => {

    const { period, setPeriod, loading } = props;
    const [open, setOpen] = React.useState(false);
    // const [startDate, setStartDate] = React.useState(null);
    // const [endDate, setEndDate] = React.useState(null);

    const [show, setShow] = React.useState(false);
    const [start, setStart] = React.useState(period[0] || null);
    const [stop, setStop] = React.useState(period[1] || null);
    const { searchRequest } = useSelector(state => state.requests);

    const close = React.useCallback(() => setOpen(false), []);

    React.useEffect(() => {
        if (open) document.addEventListener('click', close);
        else document.removeEventListener('click', close);
    }, [open]);

    React.useEffect(() => {

        if (show) {
            setPeriod([start, stop]);
            setOpen(false);
        }

        return () => setShow(false);
    }, [show]);

    React.useEffect(() => {
        if ((searchRequest ? true : false) === true) {
            setStart(null);
            setStop(null);
        } else if ((searchRequest ? true : false) === false) {
            setStart(period[0] || null);
            setStop(period[1] || null);
        }
    }, [searchRequest]);

    // React.useEffect(() => {
    //     if (startDate || endDate) {
    //         setPeriod([
    //             startDate ? moment(startDate).format("YYYY-MM-DD") : null,
    //             endDate ? moment(endDate).format("YYYY-MM-DD") : null
    //         ]);
    //     }
    // }, [startDate, endDate]);

    // const ButtonDatePicker = React.forwardRef((props, ref) => {

    //     const { value, onClick } = props;

    //     return <Button
    //         onClick={onClick}
    //         ref={ref}
    //         color={value ? "green" : null}
    //         size="tiny"
    //         icon={value ? null : <Icon name="calendar plus" fitted />}
    //         content={value}
    //         style={{ borderRadius: (startDate || endDate) ? 0 : ".25rem" }}
    //         className={(startDate || endDate) ? "px-2" : "px-3"}
    //         disabled={loading}
    //         basic={(startDate || endDate) ? false : true}
    //     />
    // });

    return <>

        <Dropdown
            icon={null}
            pointing="top right"
            trigger={<>
                <Button
                    icon="calendar plus"
                    circular
                    basic
                    onClick={() => setOpen(true)}
                />
                {period[0] &&
                    <Label
                        color="red"
                        circular
                        empty
                        size="mini"
                        className="button-label-info"
                    />
                }
            </>}
            disabled={loading || (searchRequest ? true : false)}
            open={open}
        >
            <Dropdown.Menu>
                <Dropdown.Header className="d-flex justify-content-between">
                    <div>Период</div>
                    <div>
                        <Icon
                            name="close"
                            className="button-icon"
                            onClick={() => setOpen(false)}
                        />
                    </div>
                </Dropdown.Header>

                <Dropdown.Divider />

                <div className="mb-2 mx-2">
                    <Input
                        type="date"
                        label="С"
                        className="request-filter-date"
                        value={start || ""}
                        onChange={(e, { value }) => setStart(value !== "" ? value : null)}
                    />
                </div>

                <div className="mb-2 mx-2">
                    <Input
                        type="date"
                        label="По"
                        className="request-filter-date"
                        value={stop || ""}
                        onChange={(e, { value }) => setStop(value !== "" ? value : null)}
                        disabled={start === null}
                    />
                </div>

                <div className="mx-2 mb-2">
                    <Button
                        color="green"
                        content="Применить фильтр"
                        onClick={() => setShow(true)}
                        fluid
                        disabled={start === null}
                    />
                </div>

                {period[0] && <div className="mx-2 mb-2">
                    <Button
                        color="orange"
                        content="Отменить фильтр"
                        onClick={() => {
                            setStart(null);
                            setStop(null);
                            setShow(true);
                        }}
                        fluid
                    />
                </div>}

            </Dropdown.Menu>

        </Dropdown>

        {/* <Button.Group className="btn-group-datepicker mr-1" title="Выберите период">
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
            </>}
        </Button.Group> */}

    </>
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

            {/* <div className="mr-2"> */}
            <ChangeData
                period={props.period}
                setPeriod={props.setPeriod}
                loading={props.loading}
            />
            {/* </div> */}

            <RequestsSearch {...props} />

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

        </div>

    </div>

});

export default RequestsTitle;