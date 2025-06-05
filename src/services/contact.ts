import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface IContact {
  description:string
  icon:string
  id:string
  key:string
  title:string
  type:100 |200
}

export const ContactService = {
  getList(query: QueryType) {
    return ApiService.get(`contact/index?${createQuery(query)}&expand=createdBy`);
  },
  delete(id: string) {
    return ApiService.delete(`contact/delete?id=${id}`);
  },
  create(data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`contact/create`, formData)
  },
  update(id: string, data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`contact/update?id=${id}`, formData)
  },
  // 

};
