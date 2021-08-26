import {
    SET_CONTENT_GATES,
} from './actions'

const defaultState = {
    page: "gates",
};

export const gatesReducer = (state = defaultState, action) => {

    switch (action.type) {

        case SET_CONTENT_GATES:
            return { ...state, page: action.payload }

        default:
            return state;
    
    }

}