export const SET_LOGIN = "SET_LOGIN";
export const setLogin = content => ({
    type: SET_LOGIN,
    payload: content
});

export const SET_USER_DATA = "SET_USER_DATA";
export const setUserData = content => ({
    type: SET_USER_DATA,
    payload: content
});

export const SET_USER_PERMITS = "SET_USER_PERMITS";
export const setUserPermits = content => ({
    type: SET_USER_PERMITS,
    payload: content
});

export const SET_AUTH_QUERIES = "SET_AUTH_QUERIES";
export const setAuthQueriesCount = content => ({
    type: SET_AUTH_QUERIES,
    payload: content
});

export const CHANGE_AUTH_QUERIES = "CHANGE_AUTH_QUERIES";
export const changeAuthQueriesCount = content => ({
    type: CHANGE_AUTH_QUERIES,
    payload: content
});

export const USERS_ONLINE = "USERS_ONLINE";
export const setUsersOnline = data => ({
    type: USERS_ONLINE,
    payload: data
});

export const USER_JOIN = "USER_JOIN";
export const userJoin = data => ({
    type: USER_JOIN,
    payload: data
});

export const USER_LEAVE = "USER_LEAVE";
export const userLeave = data => ({
    type: USER_LEAVE,
    payload: data
});
