import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-criminal-liability'
export interface ICriminal {
    [key: string]: any
}
export const CriminalService = {
    getListAll(employeeId: string): AxiosPromise<ICriminal[]> {
        return ApiService.get(`${main}/list-by-employee/${employeeId}`)
    },

}