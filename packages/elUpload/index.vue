<template>
  <el-form-item
    :style="config.style"
    :label-width="labelWidth"
    :label="config.showLabel ? config.label : ''"
    :prop="prop"
  >
    <el-upload
      ref="upload"
      action=""
      :accept="config.accept"
      :multiple="config.multiple || true"
      :limit="limit"
      :file-list="config.defaultValue"
      :show-file-list="config.showFileList"
      :auto-upload="true"
      :list-type="config.listType"
      :disabled="disabled"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="getCosToken"
    >
      <i class="el-icon-plus" style="font-size: 24px; border: 1px dashed #777; padding: 10px;margin-right: 5px;"></i>({{ config.defaultValue.length }})
      <div v-if="config.tip" slot="tip" class="el-upload__tip">{{ config.tip }}</div>
    </el-upload>
  </el-form-item>
</template>

<script>
import COS from 'cos-js-sdk-v5';
import moment from 'moment';
import api from '../../src/api/request';
import { resolveHost } from '../../src/config/config';

const hexList = [];
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16);
}
const buildUUID = () => {
  let uuid = '';
  for (let i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      uuid += '-';
    } else if (i === 15) {
      uuid += 4;
    } else if (i === 20) {
      uuid += hexList[(Math.random() * 4) | 8];
    } else {
      uuid += hexList[(Math.random() * 16) | 0];
    }
  }
  return uuid.replace(/-/g, '');
};
export default {
  props: ['currentItem', 'layout'],
  inject: ['handleAction', 'elForm'], // 处理action
  data() {
    return {};
  },
  computed: {
    config() {
      return this.currentItem.__config__;
    },
    labelWidth() {
      return this.config.labelWidth ? `${this.config.labelWidth}px` : null;
    },
    prop() {
      return this.groupVModel
        ? `${this.groupVModel}.${this.index}.${this.currentItem.__vModel__}`
        : this.currentItem.__vModel__;
    },
    limit() {
      return this.currentItem.limit ?? 0;
    },
    disabled() {
      return this.currentItem.disabled;
    },
    loading() {
      return this.currentItem.loading;
    }
  },
  methods: {
    handleClear() {
      this.$refs.upload.clearFiles();
    },
    handleChange(file, fileList) {
      // this.$refs.upload.submit();
      // console.error('change', file, fileList, this.config.defaultValue);
    },
    handleRemove(file) {
      const index = this.config.defaultValue.findIndex((item) => item.uid === file.uid);
      if (!~index) return;
      this.config.defaultValue.splice(index, 1);
    },
    handlePreview(file) {},
    getCosToken(file) {
      const { __config__: config } = this.currentItem;
      const { eeoHost, useParamCode, parentFormModel, paramCode, flag } = config;
      let data = {
        flag
      };
      data.__url = '/admin/costemptoken';
      data.__method = 'get';
      data.__host = eeoHost;
      data.__contentType = 'json';
      if (useParamCode) {
        const paramFunc = this.customFunction({
          code: paramCode,
          type: 'bind'
        });
        data = paramFunc(data, parentFormModel || {});
        if (!data) {
          return;
        }
      }

      api.post('/proxy/index', data).then(async (res) => {
        if (!res?.code) {
          const data = await this.uploadFileToCos(res.data, file.file);
          const imgUrl = `https://${data.Location.replace('dynamic', 'static')}`;
          config.defaultValue.push({
            name: file.file.name,
            url: imgUrl,
            id: file.file.uid
          });
        }
      });
    },
    uploadFileToCos(auth, file) {
      const { cosHost } = this.currentItem.__config__;
      if (!resolveHost(cosHost)) return;
      const cos = new COS({
        Domain:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:8000/upload'
            : resolveHost(cosHost),
        getAuthorization: function (_options, callback) {
          callback({
            TmpSecretId: auth.Credentials?.TmpSecretId,
            TmpSecretKey: auth.Credentials?.TmpSecretKey,
            SecurityToken: auth.Credentials?.Token,
            StartTime: auth.ExpiredTime - 60 * 60, // 时间戳，单位秒，如：1580000000
            ExpiredTime: auth.ExpiredTime // 时间戳，单位秒，如：1580000900
          });
        }
      });
      const Key = `${auth.Basedir}${moment(new Date()).format('YYYYMMDD')}/2F_${buildUUID()}${
        file.name.lastIndexOf('.') === -1 ? '' : file.name.substring(file.name.lastIndexOf('.'))
      }`;
      return new Promise((resolve, reject) => {
        cos.putObject(
          {
            Bucket: 'examplebucket-1250000000',
            Region: 'ap-beijing',
            Key: Key,
            StorageClass: 'STANDARD',
            Body: file
          },
          function (err, data) {
            if (err) {
              reject(err);
            }
            resolve(data);
          }
        );
      });
    }
  }
};
</script>
