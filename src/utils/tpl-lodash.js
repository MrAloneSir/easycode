import template from 'lodash/template';
import { getFilters } from './tpl-builtin';
import moment from 'moment';

const imports = {
    default: undefined,
    moment: moment,
    countDown: (end) => {
        if (!end) {
            return '--';
        }

        let date = new Date(parseInt(end, 10) * 1000);
        let now = Date.now();

        if (date.getTime() < now) {
            return '已结束';
        }

        return Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24)) + '天';
    },
    formatDate: (value, format = 'LLL', inputFormat = '') =>
        moment(value, inputFormat).format(format)
};

// 缓存一下提升性能
const EVAL_CACHE = {};

function lodashCompile(str, data) {
    try {
        const filters = getFilters();
        const finnalImports = {
            ...filters,
            formatTimeStamp: filters.date,
            formatNumber: filters.number,
            defaultValue: filters.defaut,
            ...imports
        };
        delete finnalImports.default; // default 是个关键字，不能 imports 到 lodash 里面去。
        const fn =
            EVAL_CACHE[str] ||
            (EVAL_CACHE[str] = template(str, {
                imports: finnalImports,
                // 如果不传这个，默认模板语法也存在 ${xxx} 语法，这个跟内置语法规则冲突。
                // 为了不带来困惑，禁用掉这种用法。
                interpolate: /<%=([\s\S]+?)%>/g
            }));

        return fn.call(data, data);
    } catch (e) {
        return `<span class="text-danger">${e.message}</span>`;
    }
}

export function register() {
    return {
        name: 'lodash',
        test: (str) => !!~str.indexOf('<%'),
        compile: (str, data) => lodashCompile(str, data)
    };
}
