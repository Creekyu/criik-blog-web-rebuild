import axios, { AxiosRequestConfig } from 'axios';

const service = axios.create({
  timeout: 10000,
  // baseURL: 'http://localhost:8080',
  baseURL: 'https://www.criiky0.top',
});

// Result接口
export interface Result<T = unknown> {
  message: string;
  code: number;
  data: T;
}

export interface RequestPageOptions {
  id?: string;
  page?: number;
  size?: number;
  sort?: string;
  collected?: number;
}

export interface GetPageRequest<T> {
  records: T[];
  totalSize: number;
  totalPage: number;
  pageSize: number;
  pageNum: number;
}

export interface GetCountResponse {
  count: number;
}

// 都用json发数据
service.defaults.headers.post['Content-Type'] = 'application/json';
service.defaults.withCredentials = true;
//请求拦截器
service.interceptors.request.use(config => {
  // token放入cookie自动携带了
  return config;
});

//响应拦截器
service.interceptors.response.use(
  response => {
    const data = response.data;
    // arraybuffer放行
    if (data instanceof ArrayBuffer) {
      return Promise.resolve(response);
    }
    if ('code' in data && data.code !== 200) {
      return Promise.reject(data);
    } // catch的就是data
    return Promise.resolve(response);
  },
  async error => {
    if (error.response.data) return Promise.reject(error.response.data);
    else return Promise.reject(error.response);
  }
);

// 定义接口
export const client = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get<T, Result<T>>(url, config).then(res => res.data);
  },
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.post<T, Result<T>>(url, data, config).then(res => res.data);
  },
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.put<T, Result<T>>(url, data, config).then(res => res.data);
  },
  patch<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return service.patch<T, Result<T>>(url, data, config).then(res => res.data);
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete<T, Result<T>>(url, config).then(res => res.data);
  },
};

export default service;
