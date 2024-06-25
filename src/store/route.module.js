function getRouteInfo(arr = [], result = []) {
  arr.forEach((item) => {
    let obj = {
      resourceName: item.resourceName,
      resourceId: item.resourceId + '-' + item.resourceTag + '-' + item.resourceName,
      resourceUrl: item.resourceUrl
    };
    result.push(obj);
    if (item.children) {
      getRouteInfo(item.children, result);
    }
  });
  return result;
}
export default {
  state: {
    routeObj: {}
  },
  getters: {
    getRouteInfo: (state) => (key) => {
      const routeInfo = state.routeObj[key];
      let result = [{
        resourceName: '返回上一页',
        resourceId: '-1',
        resourceUrl: '-1'
      }];
      if (routeInfo) {
        getRouteInfo(routeInfo, result);
      }
      return result;
    }
  },
  mutations: {
    setRoute(state, { key, value }) {
      state.routeObj = { [key]: value };
    }
  }
};
