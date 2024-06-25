import { ADD_HEADER } from '../utils/consts';

// 页面属性
export const formConf = {
  formRef: 'elForm',
  formModel: 'formData',
  size: 'medium',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabledExpress: '',
  span: 24,
  hasFooter: false,
  dragableGroup: 'componentsGroup',
  dataSource: [],
  model: {},
  mountedCode: {
    htmlCode: '',
    jsCode:
      '// data函数已经初始化一个this.state对象 \n \
// 可以通过this.$set初始化this.state的值 \n \
// mounted钩子函数里，可以访问this.$set, this.$route, this.$router, this.$message等方法 \n \
    function mounted() { \n \
      \n \
    }',
    cssCode: '',
    jsonCode: ''
  },
  isFilterEmpty: true,
  emptyDefault: 'null',
  edit: [
    {
      type: 'divider',
      name: '表单信息'
    },
    {
      label: '表单名',
      type: 'edString',
      model: 'formRef'
    },
    {
      label: '表单模型',
      type: 'edString',
      model: 'formModel'
    },
    {
      label: '表单尺寸',
      type: 'edSelect',
      model: 'size',
      options: [
        {
          label: '中等',
          value: 'medium'
        },
        {
          label: '较小',
          value: 'small'
        },
        {
          label: '迷你',
          value: 'mini'
        }
      ]
    },
    {
      label: '标签对齐',
      type: 'edSelect',
      model: 'labelPosition',
      options: [
        {
          label: '左对齐',
          value: 'left'
        },
        {
          label: '右对齐',
          value: 'right'
        },
        {
          label: '顶部对齐',
          value: 'top'
        }
      ]
    },
    {
      label: '标签宽度',
      type: 'edNumber',
      model: 'labelWidth'
    },
    {
      type: 'edString',
      label: '禁用表单',
      model: 'disabledExpress',
      placeholder: "Route.type === 'look'",
      explain: `
      Route或者表单名.关联组件的字段名 === 值<br/>
      例如Route.type === 'look'`
    },
    {
      label: '过滤空值',
      type: 'edBoolean',
      model: 'isFilterEmpty'
    },
    {
      label: '设置空值',
      type: 'edString',
      model: 'emptyDefault',
      visibleOn: '!this.isFilterEmpty'
    }
  ]
};

export const allowPutChild = [
  'el-block',
  'el-row',
  'to-bottom',
  'el-dialog',
  'el-filter',
  'el-form',
  'el-group',
  'el-card'
];

export const pageConfig = {
  env: {
    development: `VUE_APP_EEO_HOST=http://127.0.0.1:7001`,
    devtest: '',
    mock: '',
    pre: '',
    pro: ''
  }
};
function getEnvConfig() {
  let envConfig = sessionStorage.getItem('envConfig');
  if (envConfig) {
    return JSON.parse(envConfig);
  }
  return pageConfig.env;
}

export function resolveHost(hostName) {
  if (!hostName) return;
  let envConfig = getEnvConfig();
  let hostUrl = '';
  let tmpConfig = null;
  let env = window.SDK?.parentInfo?.hostEnv || '13'
  if (env === '13') {
    tmpConfig = parse(envConfig.development || '');
  } else if (env === '14') {
    tmpConfig = parse(envConfig.devtest || '');
  } else if (env === 'im') {
    tmpConfig = parse(envConfig.pre || '');
  } else if (env === 'master') {
    tmpConfig = parse(envConfig.pro || '');
  }
  console.log('env:', env, '\nconfig:', tmpConfig, '\nhostName:', hostName)
  hostUrl = tmpConfig?.[hostName];
  if (hostUrl) {
    return hostUrl;
  } else {
    console.log(`域名${hostName}未设置`);
  }
}

export function getHostOptions() {
  let result = [];
  let envConfig = getEnvConfig();
  let envObj = parse(envConfig.development) || {};
  if (Object.keys(envObj)?.length) {
    for (let item in envObj) {
      result.push({ label: item, value: envObj[item] });
    }
  }
  return result;
}

const LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/gm;

function parse(src) {
  const obj = {};

  // Convert buffer to string
  let lines = src.toString();

  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, '\n');

  let match;
  while ((match = LINE.exec(lines)) != null) {
    const key = match[1];

    // Default undefined or null to empty string
    let value = match[2] || '';

    // Remove whitespace
    value = value.trim();

    // Check if double quoted
    const maybeQuote = value[0];

    // Remove surrounding quotes
    value = value.replace(/^(['"`])([\s\S]*)\1$/gm, '$2');

    // Expand newlines if double quoted
    if (maybeQuote === '"') {
      value = value.replace(/\\n/g, '\n');
      value = value.replace(/\\r/g, '\r');
    }

    // Add to object
    if (key !== ADD_HEADER) {
      obj[key] = value;
    }
  }

  return obj;
}
