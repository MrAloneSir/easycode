export default {
    state: {
        intervalObj: {}
    },
    mutations: {
        addInterval(state, { key, callBack, intervalTimer }) {
            state.intervalObj[key] = setInterval(callBack, intervalTimer)
        },
        clearInterval(state, key) {
            if (state.intervalObj[key]) {
                clearInterval(state.intervalObj[key])
                state.intervalObj[key] = null
            }
        }
    }
}