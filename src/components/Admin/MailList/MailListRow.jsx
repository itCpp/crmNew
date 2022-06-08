import React from "react";
import { Icon, Loader } from "semantic-ui-react";
import moment from "../../../utils/moment";

const MailListRow = props => {

    const { row } = props;

    return <div className="admin-content-segment mail-list-row p-0">

        <div className="mail-list-row-header">
            {row.icon && <span>
                <Icon
                    name={row.icon}
                />
            </span>}
            <strong>{row.title || "Уведомление"}</strong>
        </div>

        <div className="mail-list-row-content">{row.message}</div>

        <div className="mail-list-row-footer">

            <span className="flex-grow-1">
                <Icon
                    name="lightning"
                    title="Моментальное уведомление"
                    color={row.to_push ? "yellow" : "grey"}
                    disabled={!Boolean(row.to_push)}
                />
                <Icon
                    name="talk"
                    title="Обычное уведомление"
                    color={row.to_notice ? "yellow" : "grey"}
                    disabled={!Boolean(row.to_notice)}
                />
                <Icon
                    name="desktop"
                    title="Отправить только авторизированным сотрудникам"
                    color={row.to_online ? "blue" : "grey"}
                    disabled={!Boolean(row.to_online)}
                />
                <Icon
                    name="telegram"
                    title="Дублировать в телеграм"
                    color={row.to_telegram ? "blue" : "grey"}
                    disabled={!Boolean(row.to_telegram)}
                />
            </span>

            <small>{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</small>

            <span className="ml-2">
                {Boolean(row.done_at) === false && <Loader
                    active
                    inline
                    size="mini"
                    className="m-0"
                    title="В процессе рассылки"
                    indeterminate
                />}

                {Boolean(row.done_at) === true && <Icon
                    name="check"
                    color="green"
                    fitted
                />}
            </span>

        </div>

    </div>
}

export default MailListRow;