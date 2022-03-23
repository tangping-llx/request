
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export type Options = AxiosRequestConfig
export type ExtraOptions = {
  parametersLowerCamelCase: boolean
  responceLowerCamelCase: boolean
  dataLowerCamelCase: boolean
}
export type TransformOptions = ExtraOptions

export const baseExtra = {
  parametersLowerCamelCase: true,
  responceLowerCamelCase: true,
  dataLowerCamelCase: true
}
const regToLowerCamelCase = /_+([a-z])/g
const regToUnderLine = /\B[A-Z]/g

export const transformKeyToLowerCamelCase = (key: string) => {
  return key.replace(regToLowerCamelCase, ($0, $1) => String.fromCharCode($1.charCodeAt() - 32))
}

export const transformKeyToUnderLine = (key: string) => {
  return key.replace(regToUnderLine, ($0) => '_' + String.fromCharCode($0.charCodeAt(0) + 32))
}

export const transformParams = (config?: AxiosRequestConfig, LowerCamelCase = true) => {
  if (!config) return
  const params = config.params
  if (!params) return
  const p = {} as any
  const transformFn = LowerCamelCase ? transformKeyToLowerCamelCase : transformKeyToUnderLine
  for (const key in params) {
    const k = transformFn(key)
    p[k] = params[key]
  }
  config.params = p
}

export const transformData = (config?: AxiosRequestConfig, LowerCamelCase = true) => {
  if (!config) return
  const data = config.data
  if (!data) return
  const transformFn = LowerCamelCase ? transformKeyToLowerCamelCase : transformKeyToUnderLine
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

export const transformRes = (res: any, LowerCamelCase = true) => {
  const transformFn = LowerCamelCase ? transformKeyToLowerCamelCase : transformKeyToUnderLine
  if (typeof res !== 'object') return
  if (Array.isArray(res)) {
    for (const key in res) {
      transformRes(res[key], LowerCamelCase)
    }
    return
  }
  for (const key in res) {
    const k = transformFn(key)
    res[k] = res[key]
    delete res[key]
    console.log(typeof res[k])
    if(typeof res[k] === 'object') {
      console.log(res[k], '--------')
      transformRes(res[k], LowerCamelCase)
      console.log(res[k])
    }
  }
}