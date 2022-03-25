
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export type Options = AxiosRequestConfig
export type ExtraOptions = {
  parametersType: 'none' | 'lowerCamelCase' | 'underline'
  responseType: 'none' | 'lowerCamelCase' | 'underline'
  dataType: 'none' | 'lowerCamelCase' | 'underline'
  responseData: boolean
}
export type TransformOptions = ExtraOptions

export const baseExtra: ExtraOptions = {
  parametersType: 'none',
  responseType: 'none',
  dataType: 'none',
  responseData: true
}
const regToLowerCamelCase = /_+([a-z])/g
const regToUnderLine = /\B[A-Z]/g

export const transformKeyToLowerCamelCase = (key: string) => {
  return key.replace(regToLowerCamelCase, (_, $1) => String.fromCharCode($1.charCodeAt() - 32))
}

export const transformKeyToUnderLine = (key: string) => {
  return key.replace(regToUnderLine, ($0) => '_' + String.fromCharCode($0.charCodeAt(0) + 32))
}

const getTransformFn = (parametersType: (TransformOptions['parametersType'])) => parametersType === 'lowerCamelCase'
  ? transformKeyToLowerCamelCase 
  : parametersType === 'underline'
  ? transformKeyToUnderLine 
  : null

export const transformParams = (config?: AxiosRequestConfig, parametersType: TransformOptions['parametersType'] = 'none') => {
  if (!config) return
  const params = config.params
  if (!params) return
  const p = {} as any
  const transformFn = getTransformFn(parametersType)
  if (!transformFn) return
  for (const key in params) {
    const k = transformFn(key)
    p[k] = params[key]
  }
  config.params = p
}

export const transformData = (config?: AxiosRequestConfig, dataType: TransformOptions['parametersType'] = 'none') => {
  if (!config) return
  const data = config.data
  if (!data) return
  const transformFn = getTransformFn(dataType)
  if (!transformFn) return
  if (data instanceof FormData) {
    const fd = new FormData()
    data.forEach((value, key) => {
      const k = transformFn(key)
      fd.append(k, value)
    })
    config.data = fd
    return
  }
  const d = {} as any
  for (const key in data) {
    const k = transformFn(key)
    d[k] = data[key]
  }
  config.data = d
}

export const transformRes = (res: any,  responseType: TransformOptions['parametersType'] = 'none') => {
  const transformFn = getTransformFn(responseType)
  if (!transformFn) return
  if (typeof res !== 'object') return
  if (Array.isArray(res)) {
    for (const key in res) {
      transformRes(res[key], responseType)
    }
    return
  }
  for (const key in res) {
    const k = transformFn(key)
    res[k] = res[key]
    delete res[key]
    if(typeof res[k] === 'object') {
      transformRes(res[k], responseType)
    }
  }
}


export const transformRequest = ({
  parametersType,
  dataType
}: Omit<TransformOptions, 'responseType' | 'responseData'>, config?: AxiosRequestConfig) => {
  transformParams(config, parametersType)
  transformData(config, dataType)
}

export const transformResponse = (config: AxiosResponse, responseType: TransformOptions['parametersType'] = 'none') => {
  transformRes(config.data.data, responseType)
}