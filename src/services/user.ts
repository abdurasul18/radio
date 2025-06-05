import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";

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


export const UserService = {
  getList(query: QueryType): AxiosPromise<IResponse<IUser[]>> {
    return ApiService.get(`user/index?${createQuery(query)}&expand=direction,degree`);
  },
  getById(id: string) {
    return ApiService.get(`user/view?id=${id}&expand=direction,degree`);
  },
  getCurrentUser() {
    return ApiService.get(`user/get-me?expand=direction,degree`);
  },
 
};
