import { List } from 'semantic-ui-react'

export default function VisitListRow(props) {

    const row = props.row;

    const icon = row.device === "desktop"
        ? "desktop"
        : row.device === "mobile"
            ? "mobile alternate"
            : "question circle outline"

    return <List.Item className="d-flex justify-content-between align-items-center px-2">

        <List.Icon name={icon} size="large" verticalAlign="middle" />

        <List.Content>
            <List.Header as="a">{row.site}{row.page}</List.Header>
            {row.utm_term ? <List.Description><strong>Utm term</strong>{' '}{row.utm_term}</List.Description> : null}
            {row.user_agent ? <List.Description><small className="text-wrap">{row.user_agent}</small></List.Description> : null}
        </List.Content>

        <List.Content className="flex-fill">
            <small className="text-nowrap">{row.date}</small>
            <div><small className="text-nowrap">{row.ip}</small></div>
        </List.Content>
        
    </List.Item>

}