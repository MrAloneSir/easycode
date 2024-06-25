import elBreadcrumb from './elBreadcrumb';
import Row from './row';
import elFooter from './elFooter';

import elText from './text';
import elImg from './img';
import elButton from './elButton';
import elCard from './elCard';
import ElLink from './elLink';

import elForm from './elForm';
import elGroup from './elGroup';
import elCascader from './elCascader';
import elDialog from './elDialog';
import elDropdown from './elDropdown';
import elInput from './elInput';
import elInputNumber from './elInputNumber';
import elSwitch from './elSwitch';
import elStatus from './elStatus';
import elTitle from './elTitle';
import elTag from './elTag';
import elTimeSelect from './elTimeSelect';
import elTimePicker from './elTimePicker';
import elDatePicker from './elDatePicker';
import elDateRangePicker from './elDateRangePicker';
import elTimeRangePicker from './elTimeRangePicker';
import elTree from './elTree';
import elTabs from './elTabs';
import LabelText from './labelText';

import elIcon from './elIcon';
import elCheckbox from './elCheckbox';
import elFilter from './elFilter';
import elTable from './elTable';
import elSteps from './elSteps';
import elCollapse from './elCollapse';
import elDescriptions from './elDescriptions';
import elRadioGroup from './elRadioGroup';
import elSelect from './elSelect';

import elUpload from './elUpload';


const lib = {
  name: 'el组件库',
  libs: [
    {
      title: '基础',
      list: [elButton, elTitle, elImg, elDialog, elText]
    },
    {
      title: '容器',
      list: [elFilter, elForm, Row]
    },

    {
      title: '表格',
      list: [elTable]
    },
    {
      title: '表单',
      list: [
        elGroup,
        elInput,
        elSelect,
        elRadioGroup,
        elCascader,
        elSwitch,
        elDatePicker,
        elDateRangePicker,
        elTimeSelect,
        elTimePicker,
        elTimeRangePicker,
        elInputNumber,
        elCheckbox,
        LabelText,
        elUpload
      ]
    },
    // {
    //   title: '数据展示',
    //   list: [
    //     // elStatus,
    //     // elIcon,
    //     // elTag,
    //     // elCollapse,
    //     // elTree,
    //     // elTabs,
    //     // elSteps,
    //     // elCard,
    //     // elDescriptions,
    //     // elDropdown,
    //     // ElLink
    //   ]
    // }
  ]
};

export default lib;

export const dialogSchema = elDialog;
