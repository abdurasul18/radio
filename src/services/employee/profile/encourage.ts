import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-encourage'
export interface IEncourage {
   [key: string]: any
}
export const EncourageService = {
    getListAll(employeeId: string): AxiosPromise<IEncourage[]> {
        return ApiService.get(`${main}/list-employee-id/${employeeId}`)
    },
   
}