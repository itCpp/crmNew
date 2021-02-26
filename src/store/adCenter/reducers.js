import {
    CALENDAR_START_DATE,
    CALENDAR_STOP_DATE,
} from './actions'

const defaultState = {
    dateStart: new Date(),
    dateStop: null,
};

export const adCenterReducer = (state = defaultState, action) => {

    switch (action.type) {

        case CALENDAR_START_DATE:
            return { ...state, dateStart: action.payload }

        case CALENDAR_STOP_DATE:
            return { ...state, dateStop: action.payload }

        default:
            return state;
    
    }

}