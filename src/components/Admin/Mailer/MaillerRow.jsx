import { Header, Icon, Popup } from "semantic-ui-react";
import { CounterWidjetLabel } from "../../Header/CounterWidjets";

const MaillerRow = props => {

    const { row, setRow } = props;

    return <div className="admin-content-segment d-flex align-items-center">

        <Header
            as="h4"
            icon={{
                name: row.type_icon || "mail",
                style: {
                    opacity: row.is_active ? 1 : 0.3,
                },
                color: row.is_active ? "green" : null,
            }}
            content={row.title || row.destination}
            subheader={Boolean(row.title) ? row.destination : null}
            className="flex-grow-1"
        />

        <div className="me-3">

            <Popup
                content="Отправка при смене статуса"
                size="mini"
                className="px-3 py-1"
                position="left center"
                trigger={<Icon
                    name="certificate"
                    color={Boolean(row?.config?.change_status) ? "green" : null}
                    disabled={!Boolean(row?.config?.change_status)}
                />}
            />

            <Popup
                content="Отправка при смене пина"
                size="mini"
                className="px-3 py-1"
                position="left center"
                trigger={<Icon
                    name="users"
                    color={Boolean(row?.config?.change_pin) ? "green" : null}
                    disabled={!Boolean(row?.config?.change_pin)}
                />}
            />

            <span className="me-2"></span>

            <CounterWidjetLabel
                data={{
                    count: row?.counter || 0,
                }}
                title="Отправлено"
                icon="mail forward"
            />
        </div>

        <div>
            <Icon
                name="pencil"
                link
                fitted
                title="Изменить"
                onClick={() => setRow(row)}
            />
        </div>

    </div>
}

export default MaillerRow;