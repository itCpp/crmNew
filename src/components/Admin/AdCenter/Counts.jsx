import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

function Counts(props) {

    return <div id="counter-header" className="px-3 py-2 border-bottom d-flex counter-header">

        <div className="counter-header-row">
            <span>Заявок:</span>
            <Icon name="phone" />
            <strong>{props.countRequestsCall}</strong>
            <Icon name="chat" />
            <strong>{props.countRequestsText}</strong>
        </div>

        <div className="counter-header-row">
            <span className="title-count">Посещений:</span>
            <strong>{props.countVisitSite}</strong>
        </div>

    </div>

}

const mapStateToProps = state => {
    return {
        countRequestsCall: state.adCenter.countRequestsCall,
        countRequestsText: state.adCenter.countRequestsText,
        countVisitSite: state.adCenter.countVisitSite,
    }
}

export default connect(mapStateToProps)(Counts);