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
    sub_menu:any
    answer: {
        is_correct: 1 | 0
        title: string
        file_id: string
        file: IFile | null

    }[]

}
 export const subMenus = [
    {
        name : "Genaral Knowledge",
        id: 100
    },
    {
        name : "Air Brakes",
        id:200
    },
    {
        name : "Combination Vehicles",
        id:300
    },
   {
    name : "Transporting Passengers",
    id:400
   },
   {
    name : "Hazardous Materials",
    id:500
   },
   {
    name : "Tank Vehicles",
    id:600
   },
   {
    name : "Doubles/Triple",
    id:700
   },
   {
    name : "School Bus",
    id:800
   }
]
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
