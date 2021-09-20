import { combineReducers } from 'redux';
import { adCenterReducer } from './adCenter/reducers';
import { gatesReducer } from './gates/reducers';
import { adminReducer } from './admin/reducers';
import { requestsReducer } from './requests/reducers';
import { interfaceReducer } from './interface/reducers';

import * as ACTION from './actions';

export default combineReducers({
    requests: requestsReducer,
    admin: adminReducer,
    adCenter: adCenterReducer,
    gates: gatesReducer,
    interface: interfaceReducer,
    main: (state = {
        login: false,
        userData: {},
        userPermits: {},
    }, action) => {

        switch (action.type) {

            case ACTION.SET_LOGIN:
                return { ...state, login: action.payload }

            case ACTION.SET_USER_DATA:
                return { ...state, userData: action.payload }

            case ACTION.SET_USER_PERMITS:
                return { ...state, userPermits: action.payload }

            default:
                return state;

        }

    }
});