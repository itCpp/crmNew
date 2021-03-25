import { List, Icon, Label } from 'semantic-ui-react'
import { connect } from 'react-redux'

function VisitListRowItem(props) {
    
    const show = props.show;
    const type = props.type;

    if (!show && type === "subrow")
        return null

    const row = props.row;

    const icon = row.device === "desktop"
        ? "desktop"
        : row.device === "mobile"
            ? "mobile alternate"
            : "question circle outline"

    const color = props.ipListRequests.indexOf(row.ip) >= 0
        ? "color-item-green"
        : "";

    return <>

        <List.Item
            className={`d-flex justify-content-between align-items-center px-2 ${color}`}
        >

            <div className="d-flex justify-content-center flex-column text-center" style={type === "row" ? { marginRight: ".5rem" } : { marginRight: ".5rem", marginLeft: "1.5rem" }}>
                <div className="position-relative">
                    <List.Icon name={icon} size="large" style={{ margin: 0 }} />
                    {row.views?.length ? <Label color="blue" floating circular size="mini">{row.views?.length + 1}</Label> : null}
                </div>
                {row.bot ? <div className="mt-1">
                    <List.Icon name="android" color="green" style={{ margin: 0 }} title="Бот" />
                </div> : null}
            </div>

            <List.Content className="w-100">
                <List.Header><a href={`//` + row.site + row.page} target="_blank">{row.site}{row.page}</a></List.Header>
                {row.utm_term ? <List.Description><strong>Utm term</strong>{' '}{row.utm_term}</List.Description> : null}
                {row.user_agent ? <List.Description><small className="text-wrap">{row.user_agent}</small></List.Description> : null}
            </List.Content>

            <List.Content className="flex-fill" style={{ paddingLeft: ".25rem" }}>
                <div className="d-flex align-items-center">
                    <div style={{ paddingRight: ".4rem" }}>
                        <small className="text-nowrap">{row.date}</small>
                        <div>
                            <small className={`text-nowrap ${row.greenIp ? 'green-ip-row' : ''}`}>{row.ip}</small>
                        </div>
                    </div>
                    <div>
                        {type === "row" ? <Icon 
                            name={show ? "angle up" : "angle down"}
                            className="for-hover-opacity"
                            style={row.views?.length ? { cursor: "pointer" } : { visibility: "hidden" }}
                            onClick={() => props.setShow(!show)}
                        /> : null }
                    </div>
                </div>
            </List.Content>

        </List.Item>

    </>

}

const mapStateToProps = state => ({
    ipListRequests: state.adCenter.ipListRequests
});

export default connect(mapStateToProps)(VisitListRowItem)