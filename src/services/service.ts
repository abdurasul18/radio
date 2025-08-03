import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface IService {
    file_id: string
    id: string
    name: string
    order: number
    status: 1 | 0
    file:IFile
    category_id: string
}

export const ServiceService = {
    getList(query: QueryType) {
        return ApiService.get(`service/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`service/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`service/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`service/update?id=${id}`, data)
    },
    // 

};
