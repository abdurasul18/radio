import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
import { IService } from "./service";
export interface IQuestion {
    title: string
    type: string
    menu: string
    id: string
    file: IFile
    answer: {
        is_correct: 1 | 0
        title: string
        file_id: string
        file: IFile | null

    }[]

}

export const QuestionService = {
    getList(query: QueryType) {
        return ApiService.get(`question/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`question/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`question/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`question/update?id=${id}`, data)
    },
    getById(id: string): AxiosPromise<{ data: IQuestion }> {
        return ApiService.get(`/question/view?id=${id}`)
    }
    // 

};
