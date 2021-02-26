import { combineReducers } from 'redux'
import { adCenterReducer } from './adCenter/reducers'

export default combineReducers({
    adCenter: adCenterReducer,
});