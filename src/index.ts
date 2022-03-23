import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  TransformOptions, 
  transformParams, 
  transformData, 
  Options, 
  ExtraOptions, 
  baseExtra,
  transformRes
} from './core'


const transformRequest = ({
  parametersLowerCamelCase,
  dataLowerCamelCase
}: Omit<TransformOptions, 'responceLowerCamelCase'>, config?: AxiosRequestConfig) => {
  parametersLowerCamelCase && transformParams(config)
  dataLowerCamelCase && transformData(config)
}

const transformResponse = (responceLowerCamelCase: boolean, config: AxiosResponse) => {
  responceLowerCamelCase && transformRes(config.data.data, responceLowerCamelCase)
}

export const useRequest = (opt?: Options, extra: ExtraOptions = baseExtra) => {
  const axiosInstance = axios.create(opt)
  function get <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>, extraLocal: ExtraOptions = baseExtra) {
    const parametersLowerCamelCase = extraLocal.parametersLowerCamelCase || extra.parametersLowerCamelCase
    const responceLowerCamelCase = extraLocal.responceLowerCamelCase || extra.responceLowerCamelCase
    const dataLowerCamelCase = extraLocal.dataLowerCamelCase || extra.dataLowerCamelCase
    transformRequest({
      parametersLowerCamelCase,
      dataLowerCamelCase
    }, config)
    return axiosInstance.get<T, R, D>(url, config).then(response => {
      if ((response as unknown as AxiosResponse<T>).status === 200) {
        transformResponse(responceLowerCamelCase, response as unknown as AxiosResponse<T>)
      }
      return response
    })
  }
  function post () {

  }
  function del() {

  }
  function head() {

  }
  function options() {

  }
  function put() {

  }
  function patch() {

  }
  function purge() {

  }
  function link() {

  }
  function unlink() {

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
    purge,
    link,
    unlink
  }
}