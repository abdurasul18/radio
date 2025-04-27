import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
export interface IFaculty {
  id: string
  status: number
  title: string
}

export const FacultyService = {
  getList(query: QueryType): AxiosPromise<IResponse<IFaculty[]>> {
    return ApiService.get(`faculty/index?${createQuery(query)}`);
  },
  delete(id: string) {
    return ApiService.delete(`faculty/delete?id=${id}`);
  },
  create(data:any){
    return ApiService.post(`faculty/create`, data)
  },
  update(id:string, data:any){
    return ApiService.post(`faculty/update?id=${id}`, data)
  }
};
