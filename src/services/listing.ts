import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser, IUserListItem } from "./user";
import { IService } from "./service";
import { IRegion } from "./region";
import { ICategory } from "./category";
export const ProductStatus = {
    1: 'WAITING',
    2: 'ACTIVE',
    3: 'REJECT',
}
export interface IListing {
    address:string
    category:string
    created_at:string
    currency:string
    deleted_at:string
    description:string
    details:string
    id:string
    images:{
        file : IFile
        id:string
        listing_id:string
        type:string    
    }[]
    lat:string
    lon:string
    moderation_status:string
    phone:string
    price:string
    rating:string
    region:IRegion
    region_id:string
    rejection_reason:string
    reviews_count:string
    status:string
    sub_category:string
    sub_category_id:string
    title:string
    type:string
    updated_at:string
    user:IUserListItem
    user_id:string
    views_count:string
    
}

export interface IComment {
    id: string,
    text: string,
    created_at: string,
    user: IUserListItem
}
export const ListingService = {
    getList(query: QueryType) {
        return ApiService.get(`admin/listings/index?${createQuery(query)}`);
    },
    getListAll(query: QueryType) {
        return ApiService.get(`admin/listings/moderate?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`admin/listings/delete/${id}`);
    },
    create(data: any) {
        return ApiService.post(`admin/listings/create`, data)
    },
    update(id: string, data: any) {
        return ApiService.post(`admin/listings/update/${id}`, data)
    },
    getById(id: string): AxiosPromise<{ data: IListing }> {
        return ApiService.get(`/admin/listings/view/${id}`)
    },
    // 
    getComments(query: QueryType) {
        return ApiService.get(`admin/comment/index?${createQuery(query)}`);
    },
    deleteComment(id: string) {
        return ApiService.delete(`admin/comment/delete/${id}`);
    }

};
