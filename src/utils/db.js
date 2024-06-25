const DRAWING_ITEMS = 'drawingItems';
const DRAWING_ITEMS_VERSION = '1.2';
const DRAWING_ITEMS_VERSION_KEY = 'DRAWING_ITEMS_VERSION';
const DRAWING_ID = 'idGlobal';
const TREE_NODE_ID = 'treeNodeId';
const FORM_CONF = 'formConf';
const FORM_NAME = 'formName';
const MENU = 'menu_nr';

export function getDrawingList() {
  // 加入缓存版本的概念，保证缓存数据与程序匹配
  // const version = sessionStorage.getItem(DRAWING_ITEMS_VERSION_KEY);
  // if (version !== DRAWING_ITEMS_VERSION) {
  //   sessionStorage.setItem(DRAWING_ITEMS_VERSION_KEY, DRAWING_ITEMS_VERSION);
  //   saveDrawingList([]);
  //   return null;
  // }
  const evalBlackList = ['jsCode'];
  const str = sessionStorage.getItem(DRAWING_ITEMS);
  if (str)
    return JSON.parse(str, function(k, v) {
      if (evalBlackList.indexOf(k) !== -1) {
        return v;
      }
      if (v && v.indexOf && v.indexOf('function') > -1) {
        try {
          return eval('(function(){return ' + v + ' })()');
        } catch (error) {}
      }
      return v;
    });
  return null;
}

export function saveDrawingList(list) {
  sessionStorage.setItem(
    DRAWING_ITEMS,
    JSON.stringify(list, function(key, val) {
      if (typeof val === 'function') {
        return val + '';
      }
      return val;
    })
  );
}

export function getIdGlobal() {
  const str = sessionStorage.getItem(DRAWING_ID);
  if (str) return parseInt(str, 10);
  return 100;
}

export function saveIdGlobal(id) {
  sessionStorage.setItem(DRAWING_ID, `${id}`);
}

export function getTreeNodeId() {
  const str = sessionStorage.getItem(TREE_NODE_ID);
  if (str) return parseInt(str, 10);
  return 100;
}

export function saveTreeNodeId(id) {
  sessionStorage.setItem(TREE_NODE_ID, `${id}`);
}

export function getFormConf() {
  const str = sessionStorage.getItem(FORM_CONF);
  if (str) return JSON.parse(str);
  return null;
}

export function saveFormConf(obj) {
  sessionStorage.setItem(FORM_CONF, JSON.stringify(obj));
}

export function getFormName() {
  const str = sessionStorage.getItem(FORM_NAME);
  if (str) return str;
  return null;
}

export function saveFormName(data) {
  sessionStorage.setItem(FORM_NAME, data);
}

// menu存sessionStorage
export function setMenu(data) {
  sessionStorage.setItem(MENU, JSON.stringify(data || []));
}

export function getMenu() {
  const str = sessionStorage.getItem(MENU);
  if (str) {
    return JSON.parse(str || '[]');
  }
  return null;
}
