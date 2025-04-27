import axios from 'axios'
// @ts-ignore
import { Router } from 'vue-router'
import { Ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { toast } from '../plugins/toast'
import { minimalizeText } from '../utils'
export function createQuery(data: any) {
  if (!data || typeof data != 'object') return ''
  let query = ''
  for (const key in data) {
    query += `&${key}=${data[key] || ''}`
  }
  if (query.startsWith('&')) query = query.substring(1)
  return query
}
function addLangParam(url: string) {
  return url
  const lang = useStorage('locale', 'lt').value as 'lt' | 'ru' | 'uz' | 'en'
  if (url.includes('?')) {
    return url + `&lang=${lang}`
  } else {
    return url + `?lang=${lang}`
  }
}
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_API_URL
})

let router = ref<Router>()
const ApiService = {
  _401interceptor: null,
  i: 0,
  init(baseURL: string, rt?: Router) {
    router.value = rt
    instance.defaults.baseURL = baseURL
  },
  getFile(resource: string) {
    return instance.get(resource, {
      responseType: 'blob',
    })
  },
  setHeader() {
    const { token } = toRefs(useAuthStore())
    instance.defaults.headers.common = {
      Authorization: `Bearer ${token.value}`,
    }
  },
  formData(resource: string, data: FormData, persentage?: Ref<number>) {
    return instance.post(resource, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        if (persentage) {
          persentage.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      },
    })
  },

  removeHeader() {
    instance.defaults.headers.common = {}
  },
  get(resource: string) {
    return instance.get(addLangParam(resource))
  },
  post(resource: string, data: object) {
    return instance.post(addLangParam(resource), data)
  },
  customPost(
    resource: string,
    data: object,
  ) {
    return instance.post(resource, data, {
      headers: { 'Content-Type': 'application/xml' },
    })
  },
  put(resource: string, data: object) {
    return instance.put(addLangParam(resource), data)
  },
  delete(resource: string) {
    return instance.delete(addLangParam(resource))
  },

  customRequest(data: any,) {
    const isFormData = data?.data?.constructor == FormData
    if (
      !isFormData &&
      data?.data &&
      (data?.method?.toUpperCase() === 'POST' || data?.method?.toUpperCase() === 'PUT')
    ) {
    }

    return axios(data)
  },
  mount401Interceptor: function () {
    this._401interceptor = instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (error?.response) {
          if (
            (error.response.status === 401 &&
              !window.location.pathname.startsWith('/auth'))
          ) {
            this.removeHeader()
            await router.value?.push(`/auth/login`)
            // window.location.reload()
            throw error
          } else {
            if (error.response.statusCode != 200 && error.response.statusCode != 417) {
              let message = Object.values(error.response.data.errors || {})[0] || error.response.data.message || error.response.data.error || error.response.data || 'Something went wrong'
              toast.error(message)
              throw error
            }
          }
        }
        // If error was not 401 just reject as is
        throw error
      }
    ) as any
  },

  unmount401Interceptor() {
    // Eject the interceptor
    instance.interceptors.response.eject(this._401interceptor as any)
  },
}

export default ApiService
