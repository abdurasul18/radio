import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface IVersion {
  platform: string,
  version: string,
  build_number: number,
  force_update: boolean,
  message: string,
  url: string
  id: string
}

export const VersionService = {
  getList(query: QueryType) {
    return ApiService.get(`admin/app-version?${createQuery(query)}&expand=createdBy`);
  },
  delete(id: string) {
    return ApiService.delete(`admin/app-version/${id}`);
  },
  create(data: any) {
    return ApiService.post(`admin/app-version`, data);
  },
  update(id: string, data: any) {
    return ApiService.put(`admin/app-version/${id}`, data)
  },
  // 

};
