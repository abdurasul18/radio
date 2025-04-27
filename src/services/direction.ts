import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IFaculty } from "./faculty";
export interface IDirection {
  id: string
  status: number
  name: string
  faculty_id: string
  faculty : IFaculty
}

export const DirectionService = {
  getList(query: QueryType): AxiosPromise<IResponse<IDirection[]>> {
    return ApiService.get(`direction/index?${createQuery(query)}&expand=faculty`);
  },
  delete(id: string) {
    return ApiService.delete(`direction/delete?id=${id}`);
  },
  create(data:any){
    return ApiService.post(`direction/create`, data)
  },
  update(id:string, data:any){
    return ApiService.post(`direction/update?id=${id}`, data)
  }
};
