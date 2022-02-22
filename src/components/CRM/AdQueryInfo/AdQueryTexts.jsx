import { Header, Icon } from "semantic-ui-react";
import moment from "moment";

const AdQueryTexts = props => {

    const { data } = props;

    return <div>

        {data.length === 0 && <div className="mt-5 mb-4 text-center opacity-50"><strong>Обращений не найдено</strong></div>}

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
                    content={row.source?.name || "Неизвестный источник"}
                    subheader={row.sourse_resource?.name || null}
                    className="mr-3 my-0"
                />

                <div className="flex-grow-1" title="Номер клиента">
                    <span>{row.phone}</span>
                </div>

                <div>
                    <small>{moment(row.date).format("DD.MM.YYYY HH:mm:ss")}</small>
                </div>

            </div>

            {typeof row?.query == "object" && <div style={{ fontSize: "80%" }}>

                {row.query.client_name && <div className="mr-3">
                    <strong>Имя:</strong>
                    <span>{' '}{row.query.client_name}</span>
                </div>}

                {row.query.site && <div className="mr-3">
                    <strong>Сайт:</strong>
                    <span>{' '}{row.query.site}</span>
                </div>}

                {row.query.page && <div className="mr-3">
                    <strong>Страница сайта:</strong>
                    <span>{' '}{row.query.page}</span>
                </div>}

                {row.query.region && <div className="mr-3">
                    <strong>Регион:</strong>
                    <span>{' '}{row.query.region}</span>
                </div>}

                {row.query.utm_term && <div className="mr-3">
                    <strong>utm_term:</strong>
                    <span>{' '}{row.query.utm_term}</span>
                </div>}

                {row.query.utm_medium && <div className="mr-3">
                    <strong>utm_medium:</strong>
                    <span>{' '}{row.query.utm_medium}</span>
                </div>}

                {row.query.utm_source && <div className="mr-3">
                    <strong>utm_source:</strong>
                    <span>{' '}{row.query.utm_source}</span>
                </div>}

                {row.query.utm_content && <div className="mr-3">
                    <strong>utm_content:</strong>
                    <span>{' '}{row.query.utm_content}</span>
                </div>}

                {row.query.utm_campaign && <div className="mr-3">
                    <strong>utm_campaign:</strong>
                    <span>{' '}{row.query.utm_campaign}</span>
                </div>}

                {row.query.comment && <div className="mr-3">
                    <strong>Комментарий:</strong>
                    <span>{' '}{row.query.comment}</span>
                </div>}

            </div>}

        </div>)}
    </div>

}

export default AdQueryTexts;