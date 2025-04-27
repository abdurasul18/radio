import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-performance-report'
export interface IWorkInfoDoc {
    body: string
    departmentId:string
    departmentName:string
    employeeFullName:string
    employeeId:string
    id:string
    organizationEn:string
    organizationRu:string
    staffPositionId:string
    staffPositionName:string
    hash:string
    date:string
}
export const WorkInfoDocService = {
    getList(employeeId: string): AxiosPromise<IWorkInfoDoc[]> {
        return ApiService.get(`${main}/list-by-employee/${employeeId}`)
    },
    create(data: any) {
        return ApiService.post(`${main}/create`, data)
    },
    getById(id: string) {
        return ApiService.get(`${main}/get-by-id/${id}`)
    },
    getByHash(hash: string) {
        return ApiService.post(`${main}/get-by-hash?hash=${hash}`, {})
    }
}