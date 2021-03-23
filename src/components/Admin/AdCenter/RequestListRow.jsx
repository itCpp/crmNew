import { connect } from 'react-redux';
import { List, Icon, Label } from 'semantic-ui-react'

function RequestListRow(props) {

    const row = props.row;

    const icon = row.typeReq === "call" ? "call" : "chat";

    const color = props.ipListVisits.indexOf(row.ip) >= 0
        ? "color-item-green"
        : "";

    return <List.Item className={`d-flex justify-content-center align-items-center p-2 ${color}`}>

        <List.Icon name={icon} size="large" verticalAlign="middle" />

        <List.Content>
            <List.Header>
                <span>id#{row.id_request}{' '}</span>
                <span>{row.myPhone || row.company}</span>
                {row.phone ? <span className="position-relative">
                    <Icon name="phone volume" style={{ margin: "0 .15rem 0 .5rem" }}/>
                    <span style={{ marginRight: ".25rem" }}>{row.phone}</span>
                    {row.count > 1 ? <Label color="blue" size="tiny" title="Количество звонков">{row.count}</Label> : null}
                </span> : null}
            </List.Header>
            {row.utm_term ? <List.Description><strong>Utm term</strong>{' '}{row.utm_term}</List.Description> : null}
        </List.Content>

        <List.Content className="flex-fill">
            <small className="text-nowrap">{row.date}</small>
            {row.ip && row.typeReq === "text" ? <div><small className={`text-nowrap ${row.greenIp ? 'green-ip-row' : ''}`}>{row.ip}</small></div> : null}
        </List.Content>
        
    </List.Item>

}

const mapStateToProps = state => ({
    ipListVisits: state.adCenter.ipListVisits,
})

export default connect(mapStateToProps)(RequestListRow)