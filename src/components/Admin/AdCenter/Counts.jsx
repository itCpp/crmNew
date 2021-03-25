import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import getDate from './../../../utils/date'
import AddCosts from './Costs/AddCosts'

function Counts(props) {

    // const ips = props.ips.length
    //     ? props.ips.map((ip,key) => <span key={key} className="mx-1" title={ip.title}>{ip.ip}</span>)
    //     : null

    return <div id="counter-header" className="px-3 py-2 border-bottom d-flex counter-header align-items-center">

        {props.dateStop || props.dateStop ? <div className="counter-header-row">
            <span className="counter-header-row">Период:</span>
            <strong>{getDate(props.dateStart)}</strong>
            {props.dateStop ? <strong>{' - '}{getDate(props.dateStop)}</strong> : null}
        </div> : null}

        <div className="counter-header-row">
            <span>Заявок:</span>
            <Icon name="phone" style={{ opacity: props.countRequestLoading ? ".3" : "1" }} />
            <strong style={{ opacity: props.countRequestLoading ? ".3" : "1" }}>{props.countRequestsCall}</strong>
            <Icon name="chat" style={{ opacity: props.countRequestLoading ? ".3" : "1" }} />
            <strong style={{ opacity: props.countRequestLoading ? ".3" : "1" }}>{props.countRequestsText}</strong>
        </div>

        <div className="counter-header-row">
            <span className="title-count">Посещений:</span>
            <strong style={{ opacity: props.countVisitSiteLoading ? ".3" : "1" }}>{props.countVisitSite}</strong>
        </div>

        {props.accessCosts ? <AddCosts loading={props.countRequestLoading} /> : null}

        {/* {ips ? <div className="counter-header-row">
            <span className="title-count">IP-адреса:</span>
            <strong style={{ opacity: props.countVisitSiteLoading ? ".3" : "1" }}>{ips}</strong>
        </div> : null} */}

    </div>

}

const mapStateToProps = state => {
    return {
        dateStart: state.adCenter.dateStart,
        dateStop: state.adCenter.dateStop,
        countRequestLoading: state.adCenter.countRequestLoading,
        countRequestsCall: state.adCenter.countRequestsCall,
        countRequestsText: state.adCenter.countRequestsText,
        countVisitSiteLoading: state.adCenter.countVisitSiteLoading,
        countVisitSite: state.adCenter.countVisitSite,
        ips: state.adCenter.ips,
        accessCosts: state.adCenter.accessCosts,
    }
}

export default connect(mapStateToProps)(Counts);