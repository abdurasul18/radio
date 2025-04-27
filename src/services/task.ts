import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { ICriterion } from "./criterion";
import { IPersonalTask } from "./user";
export interface ITask {
  created_at:string
  criterion:ICriterion
  description:string
  file_url:string
  id:string
  status:1|0
  title:string
  type:number
  updated_at:string
  volume:string
  userTasks: IPersonalTask[]
}
export const TaskType = {
  1: {
    name: 'Yuklangan',
    color: 'default',
  },
  2: {
    name: 'Jarayonda',
    color: 'warning',
  },
  3: {
    name: 'Yakunlangan',
    color: 'success',
  },
  4: {
    name: 'Rad etilgan',
    color: 'error',
  }
} as any
export const TaskService = {
  getList(query: QueryType): AxiosPromise<IResponse<ITask[]>> {
    return ApiService.get(`task/index?${createQuery(query)}&expand=degrees`);
  },
  delete(id: string) {
    return ApiService.delete(`task/delete?id=${id}`);
  },
  create(data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`task/create`, formData)
  },
  update(id: string, data: any) {
    return ApiService.post(`task/update?id=${id}`, data)
  }
};
