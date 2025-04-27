import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-oklad'
export interface IEmployeeOklad {
    departmentId:string
    departmentName:string
    employeeFullName:string
    employeeId:string
    id:string
    oklad:string
    okladId:string
    okladName:string
    okladSumma:string
    percentage:string
    staffPositionId:string
    staffPositionName:string
}
export const EmployeeOkladService = {
    getList(employeeId: string): AxiosPromise<IEmployeeOklad[]> {
        return ApiService.get(`${main}/list-by-employee/${employeeId}`)
    },

}