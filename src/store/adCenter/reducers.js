import {
    CALENDAR_START_DATE,
    CALENDAR_STOP_DATE,
    COUNT_REQUEST_LOADING,
    COUNT_REQUESTS_CALL,
    COUNT_REQUESTS_TEXT,
    COUNT_VISIT_SITE,
    COUNT_VISIT_SITE_LOADING,
} from './actions'

const defaultState = {
    dateStart: new Date(),
    dateStop: null,
    countRequestLoading: false, // Идентификатор загрузки данных счетчика
    countRequestsCall: 0, // Счетчик заявок по звонку
    countRequestsText: 0, // Счетчик текстовых заявок
    countVisitSiteLoading: false, // Идентификатор загрузки данных счетчика
    countVisitSite: 0, // Счетчик посещений сайта
};

export const adCenterReducer = (state = defaultState, action) => {

    switch (action.type) {

        case CALENDAR_START_DATE:
            return { ...state, dateStart: action.payload }

        case CALENDAR_STOP_DATE:
            return { ...state, dateStop: action.payload }

        case COUNT_REQUEST_LOADING:
            return { ...state, countRequestLoading: action.payload }

        case COUNT_REQUESTS_CALL:
            return { ...state, countRequestsCall: action.payload }

        case COUNT_REQUESTS_TEXT:
            return { ...state, countRequestsText: action.payload }

        case COUNT_VISIT_SITE_LOADING:
            return { ...state, countVisitSiteLoading: action.payload }

        case COUNT_VISIT_SITE:
            return { ...state, countVisitSite: action.payload }

        default:
            return state;
    
    }

}