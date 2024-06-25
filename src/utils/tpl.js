import { register as registerBulitin, getFilters } from './tpl-builtin';
import { register as registerLodash } from './tpl-lodash';

const enginers = {};
// 注册enginer
export function registerTplEnginer(name, enginer) {
  enginers[name] = enginer;
}

// 返回字符串模板
export function filter(tpl, data = {}, ...rest) {
  if (!tpl || typeof tpl !== 'string') {
    return '';
  }

  let keys = Object.keys(enginers);
  for (let i = 0, len = keys.length; i < len; i++) {
    let enginer = enginers[keys[i]];
    if (enginer.test(tpl)) {
      return enginer.compile(tpl, data, ...rest);
    } else if (enginer.removeEscapeToken) {
      tpl = enginer.removeEscapeToken(tpl);
    }
  }

  return tpl;
}

const EVAL_CACHE = {};

// 返回ture,false
export function evalExpression(expression, data) {
  if (!expression || typeof expression !== 'string') {
    return false;
  }
  /* jshint evil:true */
  try {
    let debug = false;
    const idx = expression.indexOf('debugger');
    if (~idx) {
      debug = true;
      expression = expression.replace(/debugger;?/, '');
    }
    let fn;
    if (expression in EVAL_CACHE) {
      fn = EVAL_CACHE[expression];
    } else {
      fn = new Function(
        'data',
        'utils',
        `with(data) {${debug ? 'debugger;' : ''}return !!(${expression});}`
      );
      EVAL_CACHE[expression] = fn;
    }
    data = data || {};

    return fn.call(data, data, getFilters());
  } catch (e) {
    console.warn(expression, e);
    return false;
  }
}

// 返回对应的值
export function evalJS(js, data) {
  /* jshint evil:true */
  try {
    const fn = new Function(
      'data',
      'utils',
      `with(data) {${/^\s*return\b/.test(js) ? '' : 'return '}${js};}`
    );
    data = data || {};
    return fn.call(data, data, getFilters());
  } catch (e) {
    console.warn(js, e);
    return null;
  }
}

[registerBulitin, registerLodash].forEach((fn) => {
  const info = fn();

  registerTplEnginer(info.name, {
    test: info.test,
    compile: info.compile,
    removeEscapeToken: info.removeEscapeToken
  });
});
