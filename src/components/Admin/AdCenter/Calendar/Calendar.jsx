import { connect } from 'react-redux'
import { setDateStart, setDateStop } from './../../../../store/adCenter/actions'

import CalendarTamplate from './CalendarTamplate'

function Calendar(props) {

    return <CalendarTamplate { ...props } />

}

const mapStateToProps = state => {
    return {
        dateStart: state.adCenter.dateStart,
        dateStop: state.adCenter.dateStop,
    }
}

const mapDispatchToProps = {
    setDateStart, setDateStop,
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);