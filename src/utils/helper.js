import isPlainObject from 'lodash/isPlainObject';
import qs from 'qs';

// 方便取值的时候能够把上层的取到，但是获取的时候不会全部把所有的数据获取到。
export function createObject(
    superProps,
    props,
    properties
  ) {
    if (superProps && Object.isFrozen(superProps)) {
      superProps = cloneObject(superProps);
    }
  
    const obj = superProps
      ? Object.create(superProps, {
          ...properties,
          __super: {
            value: superProps,
            writable: false,
            enumerable: false
          }
        })
      : Object.create(Object.prototype, properties);
  
    props &&
      isObject(props) &&
      Object.keys(props).forEach(key => (obj[key] = props[key]));
  
    return obj;
  }


export function cloneObject(target, persistOwnProps = true) {
    const obj =
      target && target.__super
        ? Object.create(target.__super, {
            __super: {
              value: target.__super,
              writable: false,
              enumerable: false
            }
          })
        : Object.create(Object.prototype);
    persistOwnProps &&
      target &&
      Object.keys(target).forEach(key => (obj[key] = target[key]));
    return obj;
  }

  export function isObject(obj) {
    const typename = typeof obj;
    return (
      obj &&
      typename !== 'string' &&
      typename !== 'number' &&
      typename !== 'boolean' &&
      typename !== 'function' &&
      !Array.isArray(obj)
    );
  }

  export function setVariable(
    data,
    key,
    value,
    convertKeyToPath
  ) {
    data = data || {};
  
    if (key in data) {
      data[key] = value;
      return;
    }
  
    const parts = convertKeyToPath !== false ? keyToPath(key) : [key];
    const last = parts.pop();
  
    while (parts.length) {
      let key = parts.shift();
      if (isPlainObject(data[key])) {
        data = data[key] = {
          ...data[key]
        };
      } else if (Array.isArray(data[key])) {
        data[key] = data[key].concat();
        data = data[key];
      } else if (data[key]) {
        // throw new Error(`目标路径不是纯对象，不能覆盖`);
        // 强行转成对象
        data[key] = {};
        data = data[key];
      } else {
        data[key] = {};
        data = data[key];
      }
    }
  
    data[last] = value;
  }

  export const keyToPath = (string) => {
    const result = [];
  
    if (string.charCodeAt(0) === '.'.charCodeAt(0)) {
      result.push('');
    }
  
    string.replace(
      new RegExp(
        '[^.[\\]]+|\\[(?:([^"\'][^[]*)|(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
        'g'
      ),
      (match, expression, quote, subString) => {
        let key = match;
        if (quote) {
          key = subString.replace(/\\(\\)?/g, '$1');
        } else if (expression) {
          key = expression.trim();
        }
        result.push(key);
        return '';
      }
    );
  
    return result;
  };

  export function qsstringify(
    data,
    options = {
      arrayFormat: 'indices',
      encodeValuesOnly: true
    },
    keepEmptyArray
  ) {
    // qs会保留空字符串。fix: Combo模式的空数组，无法清空。改为存为空字符串；只转换一层
    keepEmptyArray &&
      Object.keys(data).forEach((key) => {
        Array.isArray(data[key]) && !data[key].length && (data[key] = '');
      });
    return qs.stringify(data, options);
  }

  export function string2regExp(value, caseSensitive = false) {
    if (typeof value !== 'string') {
      throw new Error('Expected a string');
    }
  
    return new RegExp(
      value.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d'),
      !caseSensitive ? 'i' : ''
    );
  }

  export function deleteVariable(data, key) {
    if (!data) {
      return;
    } else if (data.hasOwnProperty(key)) {
      delete data[key];
      return;
    }
  
    const parts = keyToPath(key);
    const last = parts.pop();
  
    while (parts.length) {
      let key = parts.shift();
      if (isPlainObject(data[key])) {
        data = data[key] = {
          ...data[key]
        };
      } else if (data[key]) {
        throw new Error(`目标路径不是纯对象，不能修改`);
      } else {
        break;
      }
    }
  
    if (data && data.hasOwnProperty && data.hasOwnProperty(last)) {
      delete data[last];
    }
  }