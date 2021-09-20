import * as ACTION from './actions'

const defaultState = {
    tabs: [],
    select: null,
    requests: [],
};

export const requestsReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTION.SET_TAB_LIST:
            return { ...state, tabs: action.payload }

        case ACTION.SELECT_TAB:
            return { ...state, select: action.payload }

        case ACTION.SET_REQUESTS:
            return { ...state, requests: action.payload }

        default:
            return state;
    
    }

}