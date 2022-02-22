import { Header, Icon } from "semantic-ui-react";
import moment from "moment";

const AdQueryCalls = props => {

    const { data } = props;

    return <div>
        {data.length > 0 && data.map((row, i) => <div key={`call_${i}`} className="bg-light rounded d-flex my-1 px-3 py-2 justify-content-between align-items-center">

            {row.manual === true && <div className="mr-3">
                <Icon name="hand paper" fitted title="Добавлена вручную" color="black" />
            </div>}

            {row.ad_source === "google" && <div className="mr-3">
                <Icon name="google" color="blue" fitted />
            </div>}

            {row.ad_source === "yandex" && <div className="mr-3">
                <Icon name="yandex" color="red" fitted />
            </div>}

            <Header
                as="h5"
                content={row.source?.name || "Неизвестный источник"}
                subheader={row.resource}
                className="mr-3 my-0"
            />

            <div className="flex-grow-1" title="Номер клиента">{row.phone}</div>

            <div>
                <small>{moment(row.date).format("DD.MM.YYYY HH:mm:ss")}</small>
            </div>

        </div>)}
    </div>

}

export default AdQueryCalls;