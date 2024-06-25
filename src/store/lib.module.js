import loadScript from 'load-script';
import router from '../router'

export default {
  state: {
    libDefs: {},
    libEdit: {},
    projectLib: {},
    libSchema: {},
  },
  getters: {
    getComDef: (state) => (com) => {
      if (state.libDefs[com.__config__.tag]) {
        return state.libDefs[com.__config__.tag];
      }
      return {
        render: (h) => h('span', '')
      };
    },
    getComEdit: (state) => (com) => {
      if (com.__config__ && state.libEdit[com.__config__.tag]) {
        return state.libEdit[com.__config__.tag];
      }
      return [];
    },
    getComSchema: (state) => (com) => {
      if (state.libSchema[com.__config__.tag]) {
        return state.libSchema[com.__config__.tag];
      }
      return {};
    },
    getProjectLib: (state) => {
      return state.projectLib
    }
  },
  mutations: {
    registerComs(state, libDef) {
      const libDefMap = {};
      const libEdit = {};
      const libSchema = {}
      libDef.libs.forEach((group) => {
        group.list &&
          group.list.forEach((com) => {
            libDefMap[com.__config__.tag] = com.__config__.def;
            libEdit[com.__config__.tag] = com.edit;
            libSchema[com.__config__.tag] = com
          });
      });
      state.libDefs = {
        ...state.libDefs,
        ...libDefMap
      };
      state.libEdit = {
        ...state.libEdit,
        ...libEdit
      };
      state.libSchema = {
        ...state.libSchema,
        ...libSchema
      };
    },
    setProjectLib(state, libDef) {
      state.projectLib = libDef
    }
  },
  actions: {
    registerProjectLib({ commit }) {
      const projectTag = router.currentRoute.query.projectTag;
      if (!projectTag) {
        return
      }
      let library = `LINGJI_LIB_` + projectTag.toUpperCase();
      library = library.replace(/-/g, '_');
      if (window[library] && window[library].lib) {
        commit('registerComs', window[library].lib)
        commit('setProjectLib', window[library].lib)
        return
      }
      // loadScript(
      //   `https://cnbj1.fds.api.xiaomi.com/lingji-packages/${projectTag}/${process.env.NODE_ENV}/bundle.js`,
      //   (err) => {
      //     if (err) {
      //       console.log(err)
      //       return
      //     }
      //     if (window[library] && window[library].lib) {
      //       commit('registerComs', window[library].lib)
      //       commit('setProjectLib', window[library].lib)
      //     }
      //   }
      // );
    }
  }
};
