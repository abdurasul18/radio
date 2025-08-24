import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
import { ILesson } from "./lesson";
export interface ISubject {
    file_id: string
    id: string
    title_uz: string
    title_ru: string
    title_en: string
    order: number
    status: 1 | 0
    file: IFile
    lesson : ILesson[]
}

export const SubjectService = {
    getList(query: QueryType) {
        return ApiService.get(`subject/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`subject/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`subject/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`subject/update?id=${id}`, data)
    },
    // 

};
