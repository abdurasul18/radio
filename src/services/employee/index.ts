import { AxiosPromise } from "axios"
import ApiService, { createQuery } from "../api"
import { ResAxiosType } from "../types"
import { IEmployeeWithoutWork } from "./recruitment"
import { ILocaleNames } from "../reference"

const main = 'hrm-service/employee'
const main2 = 'hrm-service/employee-work'
export interface IEmployee extends IEmployeeWithoutWork {
    employeeId: string
    departmentName: string
    departmentId: string
    parentId: string
    departmentLocaleName : ILocaleNames
    staffPositionLocaleName: ILocaleNames
    beginDate: string
}

export const EmployeeService = {
    getCurrentUser() {
        return ApiService.get(`/${main}/get-by-session`)
    },
    getList(query?: any, body?: any): ResAxiosType<IEmployee> {
        return ApiService.post(`${main2}/list-all?${createQuery(query)}`, body)
    },
    getById(id: string):AxiosPromise<IEmployee> {
        return ApiService.get(`${main}/get-by-id/${id}`)
    },
}