import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface ILesson {
    file_id: string
    id: string
    title_uz: string
    title_ru: string
    title_en: string
    file: IFile
    description_uz: string
    description_ru: string
    description_en: string
}

export const LessonService = {
    getList(query: QueryType) {
        return ApiService.get(`lesson/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`lesson/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`lesson/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`lesson/update?id=${id}`, data)
    },
    getById(id: string): AxiosPromise<IResponse<ILesson>> {
        return ApiService.get(`lesson/view?id=${id}`);
    }

};
