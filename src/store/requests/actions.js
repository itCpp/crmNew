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