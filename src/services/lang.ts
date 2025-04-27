import { AxiosPromise, AxiosResponse } from 'axios'
import ApiService, { createQuery } from './api'
import { PayloadType, ResAxiosType } from './types'
import { ILocaleNames } from './reference'
const baseUrl = import.meta.env.VITE_API_API_SERVICE
const main = 'hrm-service/language'
export interface ILocaleText {
  code: string
  id: string
  localeName: ILocaleNames
  name: string
}
export const LangService = {
  getMessages(): AxiosPromise<ILocaleText[]> {
    return ApiService.get(`${baseUrl}${main}/list-all`)
  },
  getList(query?: any, body?: any): ResAxiosType<ILocaleText> {
    return ApiService.post(`${main}/list-search?${createQuery(query)}`, body)
  },
  update(data: { code: string; localeName: ILocaleNames }) {
    return ApiService.post(`${main}/update`, data)
  },
  create(data: { code: string; localeName: ILocaleNames }) {
    return ApiService.post(`${main}/create`, data)
  },
  delete(id: string) {
    return ApiService.delete(`${main}/delete/${id}`)
  },
  getByCode(code: string): AxiosPromise<ILocaleText> {
    return ApiService.get(`${main}/get-by-code?code=${code}`)
  }
}
