import qs from 'qs';
import { deepClone, deleteDef } from '../utils/index';
import api from './request';
import { reject } from 'lodash';
const { get, req: request, post } = api;

export const getProjectList = () => {
  return get({
    url: '/project/list',
  })
};


export const createProject = (data) => {
  return request({
    url: '/project/create',
    method: 'post',
    data
  });
};


export const deleteProject = (data) => {
  return request({
    url: '/project/delete',
    method: 'post',
    data
  });
};



export const updateProject = (data) => {
  return request({
    url: '/project/update',
    method: 'post',
    data
  });
};


export const onlinePage = async (data) => {
  try {
    return request({
      url: '/page/online',
      method: 'post',
      data
    });
  } catch (error) {
    return Promise.reject()
  }
};

export const getPageList = (data) => {
  return get({
    url: '/page/list',
    params: data
  })
};


//新建一个页面
export const resourceSave = async (data) => {
  try {
    return request({
      url: '/page/create',
      method: 'post',
      data
    });
  } catch (error) {
    return Promise.reject()
  }
};

export const getPageInfo = async (projectTag, resourceUrl, env) => {
  return request({
    url: '/page/detail',
    method: 'get',
    params: {
      projectTag,
      resourceUrl,
      env
    }
  });
};

//保存页面资源
export const pageUpdate = (data) => {
  data = deepClone(data);
  const resourceContent = JSON.parse(data.resourceContent);
  deleteDef(resourceContent);
  data.resourceContent = JSON.stringify(resourceContent);
  return request({
    url: '/page/update',
    method: 'post',
    data: data
  });
};

export const envCreate = async (data) => {
  try {
    return request({
      url: '/env/create',
      method: 'post',
      data
    });
  } catch (error) {
    return Promise.reject()
  }
};

export const envDetail = (data) => {
  return get({
    url: '/env/detail',
    params: data
  });
};

//删除页面
export const delPage = (data) => {
  return request({
    url: '/page/delete',
    method: 'post',
    data
  });
};
