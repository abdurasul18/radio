import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-holiday'
export interface IHoliday {
    beginDate:string
    departmentId:string
    departmentName:string
    directoryOrderTypeId:string
    employeeFullName:string
    employeeId:string
    endDate:string
    id:string
    orderId:string
    staffPositionId:string
    staffPositionName:string
}
export const HolidayService = {
    getListAll(employeeId: string): AxiosPromise<IHoliday[]> {
        return ApiService.get(`${main}/list-employee-id/${employeeId}`)
    },
    getActive(employeeId: string): AxiosPromise<IHoliday[]> {
        return ApiService.get(`${main}/find-active/${employeeId}`)
    },
}