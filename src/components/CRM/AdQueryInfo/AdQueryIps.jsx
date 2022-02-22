import { Header, Icon } from "semantic-ui-react";
import moment from "moment";

const AdQueryTexts = props => {

    const { data } = props;

    return <div>

        {data.length === 0 && <div className="mx-auto my-4 text-center opacity-50"><strong>Обращений не найдено</strong></div>}

        {data.length > 0 && data.map((row, i) => <div key={`call_${i}`} className="bg-light rounded my-1 px-3 py-2">

            <div className="d-flex justify-content-between align-items-center">

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
                    content={row.ip}
                    subheader={row.phone || null}
                    className="mr-3 my-0"
                />

                {row.id && <span className="mr-3">#{row.id}</span>}

                <Header
                    as="h5"
                    content={row.source?.name || "Неизвестный источник"}
                    subheader={row.query?.site || null}
                    className="flex-grow-1 mr-3 my-0"
                />

                <div>
                    <small>{moment(row.date).format("DD.MM.YYYY HH:mm:ss")}</small>
                </div>

            </div>

        </div>)}
    </div>

}

export default AdQueryTexts;