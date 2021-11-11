import * as ACTION from './actions'
// import createRequestRow from "./createRequestRow";

const defaultState = {
    tabs: [],
    select: null,
    selectedUpdate: false,
    requests: [],
    requestsIds: [],
    requestEdit: null, // Объект редактируемой заявки
    updates: {},
    counter: {},
    searchRequest: null, // Поисковой запрос
    editCell: null, // {null|object} Редактирование ячейки
};

let list = [];

const getIdList = list => list.map(r => r.id);

export const requestsReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTION.SET_TAB_LIST:
            return { ...state, tabs: action.payload }

        case ACTION.SELECT_TAB:
            return { ...state, select: action.payload, selectedUpdate: true }

        case ACTION.SELECTED_UPDATE_TAB:
            return { ...state, selectedUpdate: action.payload }

        case ACTION.SET_REQUESTS:
            return { ...state, requests: action.payload, updates: {}, requestsIds: getIdList(action.payload) }

        case ACTION.APPEND_REQUESTS:
            return {
                ...state,
                requests: [...state.requests, ...action.payload],
                requestsIds: getIdList(state.requests)
            }

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
            list = [action.payload, ...state.requests];
            return { ...state, requests: list, requestsIds: getIdList(list) }

        case ACTION.DROP_REQUEST_ROW:

            list = [...state.requests];

            list.forEach((row, i) => {
                if (row.id === action.payload) {
                    list.splice(i, 1);
                }
            });

            return { ...state, requests: list, requestsIds: getIdList(list) }

        case ACTION.COUNTER_UPDATE:
            return { ...state, counter: { ...state.counter, ...action.payload } }

        case ACTION.REQUEST_EDIT_ID:
            return { ...state, requestEdit: action.payload }

        case ACTION.REQUEST_EDIT_CELL:
            return { ...state, editCell: action.payload }

        case ACTION.SEARCH_REQUEST:
            return { ...state, searchRequest: action.payload }

        default:
            return state;

    }

}