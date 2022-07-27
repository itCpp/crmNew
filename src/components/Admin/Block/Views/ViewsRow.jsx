import React from "react";
import { Table, Icon } from "semantic-ui-react";
import moment from "moment";

const ViewsRow = props => {

    const { row, history, filterIp, loadingPage, setJsonData } = props;

    let platform = null;

    if (row.platform && row.user_agent) {
        if (row.platform.toLowerCase().indexOf('windows') >= 0)
            platform = <Icon name="windows" color="blue" disabled={loadingPage} />
        else if (row.platform.toLowerCase().indexOf('android') >= 0)
            platform = <Icon name="android" color="green" disabled={loadingPage} />
        else if (row.platform.toLowerCase().indexOf('linux') >= 0)
            platform = <Icon name="linux" color="grey" disabled={loadingPage} />
        else if (row.platform.toLowerCase().indexOf('ios') >= 0 || row.platform.toLowerCase().indexOf('os x') >= 0)
            platform = <Icon name="apple" color="grey" disabled={loadingPage} />
    }

    return <Table.Row disabled={loadingPage} style={{ fontSize: "80%" }} verticalAlign="top" negative={Boolean(row.is_blocked)}>
        <Table.Cell>
            <a href={`//${row.site}?fromadmin=${window.userId}`} target="_blank" style={{ opacity: loadingPage ? "0.4" : "1" }}>{row.site}</a>
        </Table.Cell>
        <Table.Cell>
            <pre className="mt-0 mb-1">{row.ip}</pre>
            <div>
                {Boolean(row.is_blocked) && <Icon
                    name="ban"
                    color="red"
                    title="Это блокированный вход"
                    disabled={loadingPage}
                />}
                <Icon
                    name="chart bar"
                    color="green"
                    className="button-icon"
                    title="Статистика по ip-адресу"
                    onClick={() => history.push(`/admin/block/ip?addr=${row.ip}`)}
                    disabled={loadingPage}
                />
                {row.ip !== filterIp && <Icon
                    name="filter"
                    className="button-icon"
                    title="Отобразить просмотры только этого IP"
                    onClick={() => history.push(`?ip=${row.ip}`)}
                    disabled={loadingPage}
                />}
                <Icon
                    name="code"
                    link
                    onClick={() => {
                        setJsonData(row.request_data);
                    }}
                    disabled={loadingPage}
                    title="Данные запроса"
                />
            </div>
        </Table.Cell>
        <Table.Cell>
            <div style={{ whiteSpace: "nowrap" }}>
                {moment(row.created_at).format("DD.MM.YYYY HH:mm:ss")}
            </div>
        </Table.Cell>
        <Table.Cell>
            {row.referer && <div
                style={{
                    maxWidth: 400,
                    wordWrap: "break-word",
                    opacity: loadingPage ? "0.4" : "1",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                }}
                title={`Переход с ${row.referer}`}
                className="mb-2"
            >
                <a href={row.referer} target="_blank" title={`Переход с ${row.referer}`}><Icon name="share" />{row.referer}</a>
            </div>}
            <div style={{
                maxWidth: 400,
                wordWrap: "break-word",
                opacity: loadingPage ? "0.4" : "1"
            }}>
                <a href={row.link} target="_blank">{row.link}</a>
            </div>
        </Table.Cell>
        <Table.Cell>
            {row.robot && row.user_agent && <Icon
                name="android"
                color="red"
                title="Это робот зашел"
                disabled={loadingPage}
            />}
            {row.desktop && row.user_agent && <Icon
                name="desktop"
                title={row.platform || ""}
                disabled={loadingPage}
            />}
            {row.phone && row.user_agent && <Icon
                name="mobile alternate"
                title={row.platform || ""}
                disabled={loadingPage}
            />}
            {row.tablet && row.user_agent && <Icon
                name="tablet alternate"
                title={row.platform || ""}
                disabled={loadingPage}
            />}
            {platform}
            {row.user_agent || <i>Нет информации</i>}
        </Table.Cell>
    </Table.Row>
}

export default ViewsRow;