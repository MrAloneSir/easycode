export default {
  state: {
    code: {},
    monacoVisiable: false
  },
  getters: {
    getCode: (state) => {
      return state.code;
    },
    getMonacoVisiable: (state) => {
        return state.monacoVisiable;
      }
  },
  actions:{
    changeMonacoVisiable({commit},value){
        commit('changeMonacoVisiable',value)
    }
  },
  mutations: {
    changeMonacoVisiable(state, visiable) {
      state.monacoVisiable = visiable;
    }
  }
};
