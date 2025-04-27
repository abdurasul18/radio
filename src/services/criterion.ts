import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";

export interface ICriterion {
  id: string
  name: string
  rate: string
  status: 1 | 0
  type: 1 | 2 | 3 | 4
}
export const EduTypes = [
  {
    id: 1,
    name: "O'quv",
  },
  {
    id: 2,
    name: "Ilmiy",
  },
  {
    id: 3,
    name: "Manaviy",
  },
  {
    id: 4,
    name: "Tashkiliy",
  },
];
export const CriterionService = {
  getList(query: QueryType): AxiosPromise<IResponse<ICriterion[]>> {
    return ApiService.get(`criterion/index?${createQuery(query)}`);
  },
  delete(id: string) {
    return ApiService.delete(`criterion/delete?id=${id}`);
  },
  create(data: any) {
    return ApiService.post(`criterion/create`, data);
  },
  update(id: string, data: any) {
    return ApiService.post(`criterion/update?id=${id}`, data);
  }
}; 