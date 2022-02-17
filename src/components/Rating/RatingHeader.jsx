import { Button, Dropdown, Loader } from "semantic-ui-react";
import moment from "moment";
import PeriodCalendar from "./PeriodCalendar";

const RatingHeader = props => {

    const { started, startedError, startedData, loading } = props;
    const { period, setPeriod, dates } = props;

    const date = new Date(dates?.start || moment(new Date).format("YYYY-MM-DD"));

    const setDate = (date, period = false) => {

        date = moment(date).format("YYYY-MM-DD");

        setPeriod(prev => ({
            ...prev,
            toPeriod: period,
            start: date,
            stop: period ? null : date,
        }));
    };

    const changePeriod = sub => {

        let day = date.getDate();

        if (day < 16 && sub < 0) {
            setDate(date.setMonth(date.getMonth() - 1, 16), true);
        } else if (day >= 16 && sub < 0) {
            setDate(date.setDate(1), true);
        } else if (day < 16 && sub > 0) {
            setDate(date.setDate(16), true);
        } else if (day >= 16 && sub > 0) {
            setDate(date.setMonth(date.getMonth() + 1, 1), true);
        } else {
            setDate(date, true);
        }
    }

    const setCurrent = () => {
        if (loading) return;
        if (period.toPeriod) return setDate(new Date);
        return changePeriod(0);
    }

    return <div className="rating-callcenter-row">

        <div className="d-flex justify-content-between align-items-center">

            <h2 className="m-0 flex-grow-1">Рейтинг</h2>

            {started && <div className="d-flex justify-content-center align-items-center">
                <Button.Group
                    basic
                    size="small"
                    className="mr-2"
                    buttons={[
                        {
                            key: 0,
                            icon: "angle double left",
                            title: "Предыдущий период",
                            disabled: loading,
                            onClick: () => changePeriod(-1)
                        },
                        {
                            key: 1,
                            icon: "angle left",
                            title: "Предыдущий день",
                            disabled: loading,
                            onClick: () => setDate(date.setDate(date.getDate() - 1))
                        },
                    ]}
                />

                <PeriodCalendar {...props} />

                <Button.Group
                    basic
                    size="small"
                    className="ml-2"
                    buttons={[
                        {
                            key: 1,
                            icon: "angle right",
                            title: "Следующий день",
                            disabled: loading,
                            onClick: () => setDate(date.setDate(date.getDate() + 1))
                        },
                        {
                            key: 0,
                            icon: "angle double right",
                            title: "Следующий период",
                            disabled: loading,
                            onClick: () => changePeriod(1)
                        },
                    ]}
                />
            </div>}

            {!started && !startedError && <Loader active inline indeterminate />}

        </div>

        {started && <div className="mt-2">

            <div className="d-flex justify-content-between align-items-center">

                <div>
                    {startedData?.all_access && <Dropdown
                        selection
                        placeholder="Все колл-центры"
                        options={[{ key: 0, value: null, text: "Все колл-центры" }, ...(startedData?.centers || [])]}
                        className="ml-0 mr-2"
                        disabled={loading}
                        value={period.callcenter || null}
                        onChange={(e, { value }) => setPeriod(p => ({ ...p, callcenter: value }))}
                    />}
                </div>

                <div className="flex-grow-1 d-flex justify-content-end align-items-center">

                    {/* <a style={loading ? { color: "#313131" } : { cursor: "pointer" }} onClick={setCurrent}>Показать текущий {period?.toPeriod ? "день" : "период"}</a> */}

                    <Button
                        basic
                        content={`Отобразить текущий ${period?.toPeriod ? "день" : "период"}`}
                        disabled={loading}
                        onClick={setCurrent}
                        icon={{
                            name: period.toPeriod ? "calendar check" : "calendar alternate",
                            color: period.toPeriod ? "blue" : "green",
                        }}
                        className="ml-2 mr-0"
                    />

                    <Button
                        basic
                        icon="refresh"
                        title="Обновить рейтинг"
                        className="ml-2 mr-0"
                        disabled={loading}
                        onClick={() => props.getData(true)}
                    />

                </div>

            </div>

        </div>}

    </div>

}

export default RatingHeader;