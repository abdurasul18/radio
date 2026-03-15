import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface IBanner {
  created_at: string
  id: string
  file: IFile
  order: string
}

export const BannerService = {
  getList(query: QueryType) {
    return ApiService.get(`banner/index?${createQuery(query)}&expand=createdBy`);
  },
  delete(id: string) {
    return ApiService.delete(`banner/delete?id=${id}`);
  },
  create(data: any) {
    return ApiService.post(`banner/create`, data)
  },
  update(id: string, data: any) {
    return ApiService.post(`banner/update?id=${id}`, data)
  },
  // 

};
