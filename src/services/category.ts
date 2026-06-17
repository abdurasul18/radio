import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
export type CategoryType = 1 | 2 | 3 | 4 | 5
export const categoryTypes = [
    { id: 1, name: "Shoshilinch e'lon" },
    { id: 2, name: "Umumiy xizmat" },
    { id: 3, name: "Ovqatlanish" },
    { id: 4, name: "Avtotransport xizmati" },
    { id: 5, name: "Bo'sh ish o'rni" },
]
export type CategoryCode = 'halal_food' | 'auto_service' | 'car' | 'truck' | 'real_estate'

export const CATEGORY_ENUM : { name: string; id: CategoryCode }[] = [
    {
        name : 'Halol taomlar',
        id : 'halal_food',
    },
    {
        name : 'Avtoservislar',
        id : 'auto_service',
    },
    {
        name : 'Avtomashinalar',
        id : 'car'
    },
    {
        name : 'Traklar',
        id : 'truck'
    },
    {
        name : 'Ko\'chmas mulk',
        id : 'real_estate'
    }
]
export interface ICategory {
    file_id: string
    id: string
    name_uz: string
    name_ru: string
    name_en: string
    order: number
    status: 1 | 0
    file: IFile
    type: CategoryType
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
