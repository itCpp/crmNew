import * as ACTIONS from './actions'

const defaultState = {
    topMenu: [],
};

export const interfaceReducer = (state = defaultState, action) => {

    switch (action.type) {

        case ACTIONS.SET_TOP_MENU:
            return { ...state, topMenu: action.payload }

        default:
            return state;
    
    }

}