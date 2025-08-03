import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface ICategory {
    file_id: string
    id: string
    name: string
    order: number
    status: 1 | 0
    file:IFile
}

export const CategoryService = {
    getList(query: QueryType) {
        return ApiService.get(`category/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`category/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`category/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`category/update?id=${id}`, data)
    },
    // 

};
