import React from "react";
import { Icon, Loader } from "semantic-ui-react";
import moment from "../../../utils/moment";

const MailListRow = props => {

    const { row } = props;

    return <div className="admin-content-segment mail-list-row p-0 d-flex flex-column h-100">

        <div className="mail-list-row-header">
            <span>
                <Icon
                    name={row.icon}
                    className="mr-2"
                />
            </span>
            <strong>{row.title || "Уведомление"}</strong>
        </div>

        <div className="mail-list-row-content flex-grow-1">{row.message}</div>

        <div className="mail-list-row-footer">

            <span className="flex-grow-1 d-flex align-items-center">
                <span>
                    <Icon
                        name="lightning"
                        title="Моментальное уведомление"
                        color={row.to_push ? "yellow" : "grey"}
                        disabled={!Boolean(row.to_push)}
                    />
                </span>
                <span>
                    <Icon
                        name="talk"
                        title="Обычное уведомление"
                        color={row.to_notice ? "yellow" : "grey"}
                        disabled={!Boolean(row.to_notice)}
                    />
                </span>
                <span>
                    <Icon
                        name="desktop"
                        title="Отправить только авторизированным сотрудникам"
                        color={row.to_online ? "blue" : "grey"}
                        disabled={!Boolean(row.to_online)}
                    />
                </span>
                <span>
                    <Icon
                        name="telegram"
                        title="Дублировать в телеграм"
                        color={row.to_telegram ? "blue" : "grey"}
                        disabled={!Boolean(row.to_telegram)}
                    />
                </span>
                {typeof row?.response?.to_notice?.users_id == "object" && <span className="d-flex align-items-center mr-1" style={{ opacity: ".45" }} title="Отправлено сотрудникам">
                    <span>
                        <Icon
                            name={row.anonim ? "user secret" : "user"}
                            style={{ marginRight: "2px" }}
                        />
                    </span>
                    <small>
                        <b>{Object.keys(row.response.to_notice.users_id).length}</b>
                    </small>
                </span>}
            </span>

            <small>{moment(row.created_at).format("DD.MM.YYYY HH:mm")}</small>

            <span className="ml-2">
                {Boolean(row.fail) === true && <Icon
                    name="clock"
                    color="red"
                    fitted
                    title="Ошибка по времени"
                />}

                {Boolean(row.done_at) === false && Boolean(row.fail) === false && <Loader
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