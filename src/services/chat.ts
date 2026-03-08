import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";
import { IUser, IUserListItem } from "./user";
export interface IChat {
    id: string
    text: string
    file_id: string | null
    user_id: number
    parent_id: string | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    user: IUserListItem
    file: IFile | null
    parent: IChat | null
}


export const ChatService = {
    getList(query: QueryType) {
        return ApiService.get(`admin/chat/index?${createQuery(query)}`);
    },
    delete(id: string) {
        return ApiService.delete(`admin/chat/delete/${id}`);
    },

};
