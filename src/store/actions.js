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