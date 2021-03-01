import {
    CALENDAR_START_DATE,
    CALENDAR_STOP_DATE,
    COUNT_REQUESTS_CALL,
    COUNT_REQUESTS_TEXT,
    COUNT_VISIT_SITE
} from './actions'

const defaultState = {
    dateStart: new Date(),
    dateStop: null,
    countRequestsCall: 0, // Счетчик заявок по звонку
    countRequestsText: 0, // Счетчик текстовых заявок
    countVisitSite: 0, // Счетчик посещений сайта
};

export const adCenterReducer = (state = defaultState, action) => {

    switch (action.type) {

        case CALENDAR_START_DATE:
            return { ...state, dateStart: action.payload }

        case CALENDAR_STOP_DATE:
            return { ...state, dateStop: action.payload }

        case COUNT_REQUESTS_CALL:
            return { ...state, countRequestsCall: action.payload }

        case COUNT_REQUESTS_TEXT:
            return { ...state, countRequestsText: action.payload }

        case COUNT_VISIT_SITE:
            return { ...state, countVisitSite: action.payload }

        default:
            return state;
    
    }

}