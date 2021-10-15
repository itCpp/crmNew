import * as ACTION from './actions'
import createRequestRow from "./createRequestRow";

const defaultState = {
    tabs: [],
    select: null,
    selectedUpdate: false,
    requests: [],
    updates: {},
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
            return { ...state, requests: action.payload, updates: {} }

        case ACTION.UPDATE_REQUEST_ROW:

            let requests = [...state.requests],
                updates = { ...state.updates };

            state.requests.find((item, key) => {
                if (item.id === action.payload.id) {

                    requests[key] = { ...requests[key], ...action.payload };

                    if (typeof updates[`u${action.payload.id}`] == "undefined")
                        updates[`u${action.payload.id}`] = false;
                    else
                        updates[`u${action.payload.id}`] = !updates[`u${action.payload.id}`];

                    return key;
                }
            });

            return { ...state, requests: requests, updates }

        case ACTION.CREATE_REQUEST_ROW:
            return createRequestRow(state, action.payload);

        default:
            return state;

    }

}