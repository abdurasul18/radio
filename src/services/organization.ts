import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser } from "./user";
import { IService } from "./service";
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
    status: string
    details: {
        title: string
        file_id: string | null
        file: IFile | null
    }[]
}

export const OrganizationService = {
    getList(query: QueryType) {
        return ApiService.get(`product/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`product/delete?id=${id}`);
    },
    create(data: any) {
        return ApiService.post(`product/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`product/update?id=${id}`, data)
    },
    getById(id: string): AxiosPromise<{ data: IOrganization }> {
        return ApiService.get(`/product/view?id=${id}`)
    }
    // 

};
