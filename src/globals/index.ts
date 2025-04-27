import Util from './global-methods'
declare module 'vue' {
  interface ComponentCustomProperties {
    $paginate: (index: number, page: number, limit: number) => number
    $enc: (val: string | number) => string
    $dec: (val: string | number) => string
    $baseUrl: string
    $withBaseUrl: (url?: string) => string
    $params: {
      page: number,
      limit: number
    }
  }
}
export default (app: any) => {
  for (const key in Util) {
    if (Object.prototype.hasOwnProperty.call(Util, key)) {
      app.config.globalProperties[`$${key}`] = (Util as any)[key]
    }
  }
  app.config.globalProperties.$params = { page: 0, limit: 20 }
  app.config.globalProperties.$baseUrl = import.meta.env. VITE_API_IMG_URL
  
}
