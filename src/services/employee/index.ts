import { AxiosPromise } from "axios"
import ApiService, { createQuery } from "../api"

const main = 'hrm-service/employee'

export const EmployeeService = {
    getCurrentUser() {
        return ApiService.get(`/${main}/get-by-session`)
    },

}