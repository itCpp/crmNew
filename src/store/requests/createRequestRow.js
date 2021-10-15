const createRequestRow = (state, data) => {

    console.log({ state, data });

    // return { ...state }
    return {
        ...state,
        requests: [
            {
                ...data.row,
                permits: window.requestPermits || {}
            },
            ...state.requests
        ]
    }

}

export default createRequestRow;