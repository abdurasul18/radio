import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface INotification {
  created_at: string
  description: string
  id: string
  poster: string
  published_at: string
  status: string
  title: string
  updated_at: string
}

export const NotificationService = {
  getList(query: QueryType) {
    return ApiService.get(`notification/index?${createQuery(query)}&expand=createdBy`);
  },
  delete(id: string) {
    return ApiService.delete(`notification/delete?id=${id}`);
  },
  create(data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`notification/create`, formData)
  },
  update(id: string, data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`notification/update?id=${id}`, formData)
  },
  // 

};
