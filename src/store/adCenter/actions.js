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

export const COUNT_REQUEST_LOADING = "COUNT_REQUEST_LOADING";
export const setCountRequestsLoading = loading => ({
    type: COUNT_REQUEST_LOADING,
    payload: loading
});

export const COUNT_REQUESTS_CALL = "COUNT_REQUESTS_CALL";
export const setCountRequestsCall = count => ({
    type: COUNT_REQUESTS_CALL,
    payload: count
});

export const COUNT_REQUESTS_TEXT = "COUNT_REQUESTS_TEXT";
export const setCountRequestsText = count => ({
    type: COUNT_REQUESTS_TEXT,
    payload: count
});

export const COUNT_VISIT_SITE_LOADING = "COUNT_VISIT_SITE_LOADING";
export const setCountVisitSiteLoading = loading => ({
    type: COUNT_VISIT_SITE_LOADING,
    payload: loading
});

export const COUNT_VISIT_SITE = "COUNT_VISIT_SITE";
export const setCountVisitSite = count => ({
    type: COUNT_VISIT_SITE,
    payload: count
});

export const IP_ADRESSES = "IP_ADRESSES";
export const setIpsAdresses = ips => ({
    type: IP_ADRESSES,
    payload: ips
});

export const IP_LIST_VISITS = "IP_LIST_VISITS";
export const setIpListVisits = ips => ({
    type: IP_LIST_VISITS,
    payload: ips
});

export const IP_LIST_REQUESTS = "IP_LIST_REQUESTS";
export const setIpListRequests = ips => ({
    type: IP_LIST_REQUESTS,
    payload: ips
});