export const LIMIT_ROWS_PAGE = 25;

export const SET_TAB_LIST = "SET_TAB_LIST";
export const setTabList = data => ({
    type: SET_TAB_LIST,
    payload: data
});

export const SELECT_TAB = "SELECT_TAB";
export const selectTab = data => ({
    type: SELECT_TAB,
    payload: data
});

export const SELECTED_UPDATE_TAB = "SELECTED_UPDATE_TAB";
export const selectedUpdateTab = data => ({
    type: SELECTED_UPDATE_TAB,
    payload: data
});

export const SET_REQUESTS = "SET_REQUESTS";
export const setRequests = data => ({
    type: SET_REQUESTS,
    payload: data
});

export const APPEND_REQUESTS = "APPEND_REQUESTS";
export const appendRequests = data => ({
    type: APPEND_REQUESTS,
    payload: data
});

export const REQUEST_EDIT_ID = "REQUEST_EDIT_ID";
export const requestEdit = data => ({
    type: REQUEST_EDIT_ID,
    payload: data
});

export const REQUEST_EDIT_CELL = "REQUEST_EDIT_CELL";
export const requestEditCell = data => ({
    type: REQUEST_EDIT_CELL,
    payload: data
});

export const UPDATE_REQUEST_ROW = "UPDATE_REQUEST_ROW";
export const updateRequestRow = data => ({
    type: UPDATE_REQUEST_ROW,
    payload: data
});

export const UPDATED_ROWS_FLAG = "UPDATED_ROWS_FLAG";
export const updatedRowsFlag = data => ({
    type: UPDATED_ROWS_FLAG,
    payload: data
});

export const CREATE_REQUEST_ROW = "CREATE_REQUEST_ROW";
export const createRequestRow = data => ({
    type: CREATE_REQUEST_ROW,
    payload: data
});

/** Удаление строки у старого оператора при его смене */
export const DROP_REQUEST_ROW = "DROP_REQUEST_ROW";
export const dropRequestRow = data => ({
    type: DROP_REQUEST_ROW,
    payload: data
});

/** Данные счетчика */
export const COUNTER_UPDATE = "COUNTER_UPDATE";
export const counterUpdate = data => ({
    type: COUNTER_UPDATE,
    payload: data
});

export const SEARCH_REQUEST = "SEARCH_REQUEST";
export const setSearchRequest = data => ({
    type: SEARCH_REQUEST,
    payload: data
});
