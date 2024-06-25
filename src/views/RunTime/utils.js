/**
 * 根据tag查找当前节点父节点及sortId
 * @param {*} resourceTag
 * @param {*} data
 * @returns
 */
export function findMenuParent(resourceTag, data) {
  let parent = [],
    currentSortId = '';
  const _ = (resourceTag, data) => {
    for (const item of data || []) {
      if (item.resourceTag == resourceTag) {
        parent = data;
        currentSortId = item.sortId;
        return;
      }
      item.children && _(resourceTag, item.children);
    }
  };
  _(resourceTag, data);
  return { parent, currentSortId };
}
/**
 * 根据tag查找当前节点同级山下节点
 * @param {*} resourceTag
 * @param {*} data
 * @returns
 */
export function judgeUpDown(resourceTag, data) {
  let pre = null,
    last = null;
  for (let i = 0; i < data.length; i++) {
    if (data[i].resourceTag == resourceTag) {
      if (i - 1 >= 0 && i - 1 <= data.length - 1) pre = data[i - 1];
      if (i + 1 >= 0 && i + 1 <= data.length - 1) last = data[i + 1];
      break;
    }
  }
  return { pre, last };
}
/**
 * 查找menu数据路径，用于判断深度
 * @param {*} tree
 * @param {*} func
 * @param {*} path
 * @returns
 */
export function treeFindPath(tree, func, path = []) {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data.value);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}

// 筛选isshow的数据
export function dealMenuData(data) {
  let res = [];
  for (const item of data || []) {
    let children = [];
    if (item?.children && item?.children?.length) children = dealMenuData(item?.children);
    //必须是公开的
    if (item?.isShow) {
      res.push({ ...item, children });
    }
  }
  return res;
}

// 筛选isLowCode数据
export function filterIsLowCodeMenu(menu) {
  let res = [];
  for (const item of menu || []) {
    if (item.isLowcode == '1') {
      let child = [];
      if (item?.children?.length > 0) {
        child = filterIsLowCodeMenu(item.children);
      }
      res.push({
        ...item,
        children: child
      });
    }
  }
  return res;
}

//判断二级菜单是否可编辑
export function level2HasEdit(item) {
  let isEdit = true;
  if (item?.children?.length) {
    for (const key of item.children) {
      if (key.isShow == 1) {
        isEdit = false;
        break;
      }
    }
  }
  return isEdit;
}

// flatMenuData(data) {
//   let res = [];
//   let arr = [];
//   let i = 0;
//   let x = 0;
//   const _ = (data) => {
//     for (let j = data?.length - 1; j >= 0; j--) {
//       // 过滤单一元素
//       // if (!(data[j]?.parentId == 0 && data[j]?.children?.length == 0)) {
//       if (data[j].children && data[j].children.length) _(data[j].children);
//       //必须是lowcode
//       if (data[j]?.isLowcode == 1) {
//         res.push({ ...data[j], children: [] });
//         i++;
//       }
//       if (data[j]?.parentId == 0) {
//         const y = res?.slice(x, i)?.reverse();
//         arr = arr?.concat(y);
//         x = i;
//       }
//       // }
//     }
//   };
//   _(data);
//   return arr;
// },

// convertToArr(arr) {
//   let res = [];
//   for (let i = 0; i < arr?.length; i++) {
//     if (arr[i]?.parentId == 0) {
//       let j = i + 1;
//       while (j < arr?.length && arr[j].parentId !== 0) {
//         arr[i].children.push(arr[j]);
//         j++;
//       }
//       res.push(arr[i]);
//       i = j - 1;
//     }
//   }
//   return res;
// },

//判断tag是否存在于菜单中
export function checkTagInMenu(menu, resourceTag, projectId) {
  let flag = false,
    parentItem = null;
  const _ = (menu, resourceTag, projectId, parent) => {
    for (const item of menu || []) {
      if (item.projectId == projectId && item.resourceTag == resourceTag) {
        parentItem = parent;
        flag = true;
        return;
      }
      _(item?.children, resourceTag, projectId, item);
    }
  };
  _(menu, resourceTag, projectId, null);
  return { flag, parentItem };
}

/**
 * 校验排序唯一性
 */
export function valueInSorts(value, resourceTag, optionsData) {
  let currentItem = [];
  const _ = (resourceTag, menus) => {
    for (const item of menus || []) {
      if (item.resourceTag === resourceTag) {
        currentItem = item;
        return;
      }
      if (item?.children?.length) _(resourceTag, item.children);
    }
  };
  _(resourceTag, optionsData);
  let flag = true;
  value = Number(value);
  for (const item of currentItem.children || []) {
    if (value === item.sortId) {
      flag = false;
      break;
    }
  }
  return flag;
}

/**
 * 为级联上级资源准备数据
 * @param {*} data
 * @returns
 */
export const recursiveData = (data) => {
  let arr = [];
  for (const item of data || []) {
    let children = [];
    if (item?.children && item?.children?.length) {
      children = recursiveData(item.children);
    }
    if (children?.length) {
      arr.push({
        value: `${item.resourceId}/${item.resourceTag}`,
        label: item.resourceName,
        children
      });
    } else {
      arr.push({ value: `${item.resourceId}/${item.resourceTag}`, label: item.resourceName });
    }
  }
  return arr;
};

/**
 * 获取当前时间
 */
export function getNowFormatDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  var currentdate =
    year + month + strDate + date.getHours() + date.getMinutes() + date.getSeconds();
  return currentdate;
}

export function splitResource(str) {
  let resourceId = '',
    resourceTag = '',
    resourceName = '';
    if(str) {
      const start = str.indexOf('-');
      const end = str.lastIndexOf('-');
      if(start > 0 && end > 0) {
        resourceId = str?.slice(0, start);
        resourceName = str?.slice(end + 1, str.length);
        resourceTag = str?.slice(start + 1, end);
      } else {
        console.log('splitResource argument error, str=', str);
      }
    } else {
      console.log('splitResource argument error, str is null');
    }

  return {
    resourceId,
    resourceTag,
    resourceName
  };
}
