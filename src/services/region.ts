import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface IRegion {
    id: string
    name: string
}

export const RegionService = {
    getList(query: QueryType) {
        return ApiService.get(`region/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`region/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`region/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`region/update?id=${id}`, data)
    },
    // 

};
