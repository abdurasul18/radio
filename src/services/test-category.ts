import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
import { ILesson } from "./lesson";
export interface ITestCategory {
    id: string
    name :string
    menu: string
}

export const TestCategoryService = {
    getList(query: QueryType) {
        return ApiService.get(`group/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`group/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`group/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`group/update?id=${id}`, data)
    },
    view(id: string) {
        return ApiService.get(`group/view?id=${id}`);
    }
    // 

};
