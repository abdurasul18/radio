import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-detached-duty'
export interface IDuty {
    address: string
    apartment: string
    basis: string
    beginDate: string
    departmentId: string
    departmentName: string
    destination: string
    employeeFullName: string
    employeeId: string
    employeeOrderDate: string
    employeeOrderId: string
    employeeOrderRegNumber: string
    employeeOrderTitle: string
    endDate: string
    id: string
    organizationId: string
    organizationName: string
    purpose: string
    regionId: string
    regionName: string
    staffPositionId: string
    staffPositionName: string
    task: string
    transport: string
}
export const DutyService = {
    getListAll(employeeId: string): AxiosPromise<IDuty[]> {
        return ApiService.get(`${main}/list-by-employee/${employeeId}`)
    },

}