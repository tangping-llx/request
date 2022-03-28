```ts 
import { useRequest } from '@tonyptang/request'

const { 
  instance: axiosInstance,
  get,
  del,
  head,
  options,
  post,
  put,
  patch,
  purge
} = useRequest({} /* AxiosConfig */, {} /* transformKey config */)

get(``, AxiosConfig, transformKeyConfig)

axiosInstance.interceptors.request.use(c => c)

```