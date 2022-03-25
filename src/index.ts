import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import { 
  Options, 
  ExtraOptions, 
  baseExtra,
  transformRequest,
  transformResponse,
  TransformOptions
} from './core'

const handleResponse = <T>(response: AxiosResponse, responseType: TransformOptions['responseType']) => {
  if ((response as unknown as AxiosResponse<T>).status === 200) {
    transformResponse(response as unknown as AxiosResponse<T>, responseType)
  }
}

const getConfig = (extra: ExtraOptions, extraLocal: ExtraOptions) => {
  const parametersType = extraLocal.parametersType || extra.parametersType
  const responseType = extraLocal.responseType || extra.responseType
  const dataType = extraLocal.dataType || extra.dataType
  const responseData = extraLocal.responseData || extra.responseData
  return {
    parametersType,
    responseType,
    dataType,
    responseData
  }
}

const fetch = <T = any, R = AxiosResponse<T>, D = any> ({
  method,
  url,
  config,
  extraLocal,
  extra,
  instance
}: FetchOptions<D>) => {
  const {
    parametersType,
    responseType,
    dataType,
    responseData
  } = getConfig(extra, extraLocal)
  transformRequest({
    parametersType,
    dataType
  }, config)
  return instance[method]<T, R, D>(url, config).then(response => {
    const res = response as unknown as AxiosResponse<T> 
    handleResponse<T>(res, responseType)
    return responseData && res.status === 200 ? res.data : res
  })
}

export const useRequest = (opt?: Options, extra: ExtraOptions = baseExtra) => {
  const axiosInstance = axios.create(opt)
  function get <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'get',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function post <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'post',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function del <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'delete',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'head',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'options',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function put<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'put',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function patch<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'patch',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  function purge<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: D & AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    return fetch<T, R, D>({
      method: 'patch',
      url,
      config,
      extra,
      extraLocal,
      instance: axiosInstance
    })
  }
  return {
    instance: axiosInstance,
    get,
    del,
    head,
    options,
    post,
    put,
    patch,
    purge
  }
}

type Method = 'get' | 'post' | 'delete' | 'head' | 'options' | 'put' | 'patch'

type FetchOptions<D = any> = {
  method: Method,
  url: string,
  config?: D & AxiosRequestConfig<D>,
  extraLocal: ExtraOptions,
  instance: AxiosInstance,
  extra: ExtraOptions
}