import { Button, Icon, Dropdown } from "semantic-ui-react";
import PeriodCalendar from "./PeriodCalendar";

const RatingHeader = props => {

    const { loading } = props;
    const { period, setPeriod, dates } = props;

    return <div className="rating-callcenter-row">

        <h3 className="text-center">Рейтинг</h3>

        <div className="d-flex justify-content-center align-items-center">
            <Button.Group
                basic
                size="small"
                className="mr-1"
                buttons={[
                    {
                        key: 0,
                        icon: "angle double left",
                        title: "Предыдущий период",
                        disabled: loading,
                    },
                    {
                        key: 1,
                        icon: "angle left",
                        title: "Предыдущий день",
                        disabled: loading,
                    },
                ]}
            />

            <PeriodCalendar {...props} />

            <Button.Group
                basic
                size="small"
                className="ml-1"
                buttons={[
                    {
                        key: 1,
                        icon: "angle right",
                        title: "Следующий день",
                        disabled: loading,
                    },
                    {
                        key: 0,
                        icon: "angle double right",
                        title: "Следующий период",
                        disabled: loading,
                    },
                ]}
            />
        </div>

    </div>

}

export default RatingHeader;