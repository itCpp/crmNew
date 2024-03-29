import * as A from './actions'

const defaultState = {
    subMenuPoints: null,
    panelMenuPoints: null,
};

export const adminReducer = (state = defaultState, action) => {

    switch (action.type) {

        case A.SET_SUB_MENU_POINTS:
            return { ...state, subMenuPoints: action.payload }

        case A.SET_PANEL_MENU_POINTS:
            return { ...state, panelMenuPoints: action.payload }

        default:
            return state;
    
    }

}