export default {
    state: {
        refObj: {}
    },
    getters: {
        getRef: state => {
            return state.refObj
        }
    },
    mutations: {
        setRef(state, { key, value }) {
            state.refObj = { [key]: value }
        }
    }
}