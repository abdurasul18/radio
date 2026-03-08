import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";

export interface IUser {
  token: string;
  exp: string
  first_name: string
  iat: string
  id: string
  last_name: string
  username: string
}
export interface IUserDocument {
  comment: string
  file_url: string
  format: string
  id: string
  type: string
  user_id: string
}
export interface IUserListItem {
  avatar: IFile | null
  createdAt: string
  first_name: string
  id: string
  is_verified: boolean
  last_name: string
  phone: string
}


export const UserService = {
  getList(query: QueryType) {
    return ApiService.get(`/admin/user/index?${createQuery(query)}`);
  },
  getById(id: string) {
    return ApiService.get(`user/view?id=${id}&expand=direction,degree`);
  },
  getCurrentUser() {
    return ApiService.get(`user/get-me?expand=direction,degree`);
  },
  delete(id: string) {
    return ApiService.delete(`user/delete?id=${id}`);
  },
  update(id: string, payload: any) {
    return ApiService.post(`/admin/user/update/${id}`, payload);
  },
  create(payload: any) {
    return ApiService.post(`admin/user/create`, payload);
  },
  toggleStatus(id: string) {
    return ApiService.post(`admin/user/toggle-status/${id}`, {});
  }
};
