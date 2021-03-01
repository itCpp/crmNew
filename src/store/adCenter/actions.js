export const CALENDAR_START_DATE = "CALENDAR_START_DATE";

export const setDateStart = date => ({
    type: CALENDAR_START_DATE,
    payload: date
});

export const CALENDAR_STOP_DATE = "CALENDAR_STOP_DATE";

export const setDateStop = date => ({
    type: CALENDAR_STOP_DATE,
    payload: date
});

export const COUNT_REQUESTS_CALL = "COUNT_REQUESTS_CALL";

export const setCountRequestsCall = date => ({
    type: COUNT_REQUESTS_CALL,
    payload: date
});

export const COUNT_REQUESTS_TEXT = "COUNT_REQUESTS_TEXT";

export const setCountRequestsText = date => ({
    type: COUNT_REQUESTS_TEXT,
    payload: date
});

export const COUNT_VISIT_SITE = "COUNT_VISIT_SITE";

export const setCountVisitSite = date => ({
    type: COUNT_VISIT_SITE,
    payload: date
});