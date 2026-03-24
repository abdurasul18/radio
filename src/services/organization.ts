import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser, IUserListItem } from "./user";
import { IService } from "./service";
export const ProductStatus = {
    1: 'WAITING',
    2: 'ACTIVE',
    3: 'REJECT',
}
export interface IOrganization {
    address: string
    description: string
    files: {
        id: string
        file_id: string
        product_id: string
        file: IFile
    }[]
    id: string
    lat: string
    lon: string
    name: string
    order: string
    phone_number: string
    region_id: string
    service: IService
    service_id: string
    status: 1 | 0
    category_id: string
    contact_name: string
    is_24_7: boolean
    work_time_from: string
    website: string
    work_time_to: string
    email: string
    salary: string
    position: string
    salary_type: any
    user : IUserListItem
}

export interface IComment {
    id: string,
    text: string,
    created_at: string,
    user: IUserListItem
}
export const OrganizationService = {
    getList(query: QueryType) {
        return ApiService.get(`product/index?${createQuery(query)}`);
    },
    getListAll(query: QueryType) {
        return ApiService.get(`product/moderate?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`product/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`product/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`product/update/${id}`, data)
    },
    getById(id: string): AxiosPromise<{ data: IOrganization }> {
        return ApiService.get(`/product/view/${id}`)
    },
    // 
    getComments(query: QueryType) {
        return ApiService.get(`admin/comment/index?${createQuery(query)}`);
    },
    deleteComment(id: string) {
        return ApiService.delete(`admin/comment/delete/${id}`);
    }

};
