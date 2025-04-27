import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IDegree } from "./degree";
import { IDirection } from "./direction";
import { ITask } from "./task";

export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  birthday: string;
  phone: string;
  address: string;
  bio: string;
  degree_id: number;
  direction_id: number;
  username: string;
  role: number;
  avatar: string;
  passport: string;
  password?: string;
  password_confirm?: string;
  status?: number;
  degree?: IDegree
  direction?: IDirection
  processing_lesson_count?: number
  processing_task_count?: number
}
export interface IUserDocument {
  comment: string
  file_url: string
  format: string
  id: string
  type: string
  user_id: string
}
export interface IPersonalTask {
  academicYear: {
    id: string
    status: string
    title: string
  }
  created_at: string
  deadline: string
  file: {
    file_url: string
    format: string
  }
  id: string
  month: string
  rate: string
  status: 1 | 2 | 3 | 4
  task: ITask
  type: number
  updated_at: string
  year: string

}
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
export const UserService = {
  getList(query: QueryType): AxiosPromise<IResponse<IUser[]>> {
    return ApiService.get(`user/index?${createQuery(query)}&expand=direction,degree`);
  },
  getById(id: string) {
    return ApiService.get(`user/view?id=${id}&expand=direction,degree`);
  },
  delete(id: string) {
    return ApiService.delete(`user/delete/${id}`);
  },
  create(data: any) {
    return ApiService.post(`user/create`, data);
  },
  update(id: string, data: any) {
    return ApiService.post(`user/update?id=${id}`, data);
  },
  getCurrentUser() {
    return ApiService.get(`user/get-me?expand=direction,degree`);
  },
  profileUpdate(data: any) {
    return ApiService.post(`user/profile-update`, data);
  },
  updatePassword(data: any) {
    return ApiService.post(`user/password-update`, data);
  },
  // 
  getDocuments(userId: string) {
    return ApiService.get(`user/view?id=${userId}&expand=documents`);
  },
  addDocument(data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`user/add-document`, formData);
  },
  downloadExcel() {
    return ApiService.get(`user/export-excel`);
  },
  getPersonalTask(userId: string): AxiosPromise<IResponse<IPersonalTask[]>> {
    return ApiService.get(`user/personal-task?user_id=${userId}`);
  },
  addTask(userId: string, data: any) {
    return ApiService.post(`user/add-task?id=${userId}`, data);
  },
  updateTask(userId: string, user_task_id: string, data: any) {
    return ApiService.post(`user/add-task?id=${userId}&user_task_id=${user_task_id}`, data);
  },
  // 
  getYuklama(userId: string): AxiosPromise<IResponse<ITask[]>> {
    return ApiService.get(`user/tasks?user_id=${userId}&expand=userTasks`);
  },
  getAttendance(): AxiosPromise<IResponse<IAttedance[]>> {
    return ApiService.get(`user/attendance?expand=user`);
  },
  // 
  taskCompleting(query: { task_id: string, user_task_id: any }, data: any) {
    let formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return ApiService.formData(`user/task-completing?${createQuery(query)}`, formData);
  },
  //
  taskConfirm(user_task_id: string) {
    return ApiService.post(`user/task-confirm?user_task_id=${user_task_id}`, {});
  },
  taskReject(user_task_id: string) {
    return ApiService.post(`user/task-cancel?user_task_id=${user_task_id}`, {});
  }
};
