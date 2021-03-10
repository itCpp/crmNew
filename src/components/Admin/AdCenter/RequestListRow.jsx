import { List, Icon } from 'semantic-ui-react'

export default function RequestListRow(props) {

    const row = props.row;

    const icon = row.typeReq === "call" ? "call" : "chat";

    return <List.Item className="d-flex justify-content-center align-items-center px-2" >

        <List.Icon name={icon} size="large" verticalAlign="middle" />

        <List.Content>
            <List.Header>
                <span>id#{row.id_request}{' '}</span>
                <span>{row.myPhone || row.company}</span>
                {row.phone ? <span><Icon name="phone volume" style={{ margin: "0 .15rem 0 .5rem" }}/>{row.phone}</span> : null}
            </List.Header>
            {row.utm_term ? <List.Description><strong>Utm term</strong>{' '}{row.utm_term}</List.Description> : null}
        </List.Content>

        <List.Content className="flex-fill">
            <small className="text-nowrap">{row.date}</small>
            {row.ip && row.typeReq === "text" ? <div><small className={`text-nowrap ${row.greenIp ? 'green-ip-row' : ''}`}>{row.ip}</small></div> : null}
        </List.Content>
        
    </List.Item>

}