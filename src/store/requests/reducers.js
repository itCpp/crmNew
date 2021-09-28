import * as ACTION from './actions'

const defaultState = {
    tabs: [],
    select: null,
    selectedUpdate: false,
    requests: [],
};

export const requestsReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTION.SET_TAB_LIST:
            return { ...state, tabs: action.payload }

        case ACTION.SELECT_TAB:
            return { ...state, select: action.payload, selectedUpdate: true }

        case ACTION.SELECTED_UPDATE_TAB:
            return { ...state, selectedUpdate: action.payload }

        case ACTION.SET_REQUESTS:
            return { ...state, requests: action.payload }

        case ACTION.UPDATE_REQUEST_ROW:

            let requests = [...state.requests];

            state.requests.find((item, key) => {
                if (item.id === action.payload.id) {
                    requests[key] = action.payload;
                    return key;
                }
            });

            return { ...state, requests: requests }

        default:
            return state;
    
    }

}