export default {
  state: {
    modelRef: {},
    checkedTableColumns: []
  },
  getters: {
    getModelName: (state) => {
      return Object.keys(state.modelRef);
    },
    getModelValue: (state) => (key) => {
      // console.log('10', state.modelRef, key);

      return state.modelRef[key];
    },
    getModelRef: (state) => {
      return state.modelRef;
    },
    getcheckedTableColumns: (state) => {
      return state.checkedTableColumns;
    }
  },
  mutations: {
    addModel(state, { key, value }) {
      // console.log('20', key, 21, value);

      if (value) {
        state.modelRef = { ...state.modelRef, [key]: value };
      } else {
        state.modelRef = { ...state.modelRef, [key]: {} };
      }
    },
    changeModel(state, { key, __vModel__, value }) {
      const model = state.modelRef[key];
      state.modelRef[key] = { ...model, [__vModel__]: value };
    },
    deleteModel(state, key) {
      delete state.modelRef[key];
    },
    clearModel(state) {
      state.modelRef = {};
    },
    setModelRef(state, ref) {
      state.modelRef = Object.assign(state.modelRef, ref);
    },
    changeCheckedTableColumns(state, value) {
      state.checkedTableColumns = value;
    }

    // changeModel(state, { key, model }) {
    //    const index = state.modelList.findIndex(item => item.key === key)
    //    state.modelList.splice(index, 1, {
    //        key,
    //        model
    //    })

    // }
  }
};
