import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IUser } from "./user";

export interface IAttedance {
    created_at: string
    created_by: string
    end_day: string
    id: string
    month: string
    start_day: string
    time_table_file_id: string
    updated_at: string
    updated_by: string
    user: IUser
    user_id: string
    year: string
}
export const AttendanceService = {
    getList(query: QueryType): AxiosPromise<IResponse<IAttedance[]>> {
        return ApiService.get(`user/attendance?expand=user&${createQuery(query)}`);
    },

}; 