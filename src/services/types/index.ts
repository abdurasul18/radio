import { AxiosPromise, AxiosResponse } from "axios"

export type PayloadType<T = any> = {
  query?: any,
  body?: any
}
export interface ResType<T = any> {
  total: number,
  list: T[]
}
export type QueryType = {
  [key: string]: string
}

export type ResAxiosType<T = any> = Promise<AxiosResponse<ResType<T>>>

export type IResponse<T = any> = {
  data: T,
  message: string,
  code: number
  meta: {
    currentPage: number
    pageCount: number
    perPage: number
    totalCount: number
  }
}
export type IResponseAxios<T = any> = AxiosPromise<IResponse<T>>

export interface IFile {
  extension: string
  id?: string
  name: string
  uploadPath: string
  path?: string
}