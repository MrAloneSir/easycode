export default {
    state: {
        state: {}
    },
    getters: {
        getState: (state) => {
            return state.state;
        },
    },
    mutations: {
        changeState(state, newState ) {
            state.state = { ...newState }
        }
    }
}