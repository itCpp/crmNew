const defaultState = {
    selectTab: null,
}

export function requestReducer(state = defaultState, action) {

    switch (action.type) {
        case "SELECT_TAB":
            return { ...state, selectTab: action }

        default:
            return { ...state }
    }

}