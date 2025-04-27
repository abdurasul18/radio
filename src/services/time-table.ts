import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IUser } from "./user";
export interface ITimeTable {
  created_at: string
  created_by: string
  end_day: string
  file: string
  id: string
  month: string
  start_day: string
  status: 1 | 0
  year: string
}
export interface ITimeTableOwn {
  created_at: string
  created_by: string
  end_day: string
  id: string
  month: string
  start_day: string
  time_table_file_id: string
  updated_at: string
  updated_by: string
  user_id: string
  year: string
  timeTableDetails: ITimeTableDetail[]
}

export interface ITimeTableDetail {
  created_at: string
  created_by: string
  day: string
  end_time: string
  group_name: string
  id: string
  room_number: string
  start_time: string
  status: 1 | 2 | 3 | 4
  subject: string
  timetable_id: string
  updated_at: string
  updated_by: string
  updatedBy: IUser


}
export const TimeTableStatus = {
  1: {
    name: 'Yuklangan',
    color: 'default',
  },
  2: {
    name: 'Bajarilgan',
    color: 'info',
  },
  3: {
    name: 'Rad etilgan',
    color: 'error',
  },
  4: {
    name: 'Tasdiqlangan',
    color: 'success',
  }
}
export const TimeTableService = {
  getList(query: QueryType): AxiosPromise<IResponse<ITimeTable[]>> {
    return ApiService.get(`time-table/index?${createQuery(query)}&expand=createdBy`);
  },
  delete(id: string) {
    return ApiService.delete(`time-table/delete?id=${id}`);
  },
  create(data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`time-table/create`, formData)
  },
  update(id: string, data: any) {
    return ApiService.post(`time-table/update?id=${id}`, data)
  },
  // 
  getOwn(data: any): AxiosPromise<IResponse<ITimeTableOwn[]>> {
    return ApiService.get(`user/time-table?${createQuery(data)}&expand=timeTableDetails,timeTableDetails.updatedBy`)
  },
  lessonConfirm(id: string) {
    return ApiService.post(`/user/lesson-confirm?time_table_detail_id=${id}`, {})
  },
  confirmByAdmin(id: string) {
    return ApiService.post(`/user/lesson-confirm-by-admin?time_table_detail_id=${id}`, {})
  },
  cancelByAdmin(id: string) {
    return ApiService.post(`/user/cancel-lesson-by-admin?time_table_detail_id=${id}`, {})
  }
};
