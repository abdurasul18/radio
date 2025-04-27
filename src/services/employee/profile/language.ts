import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-language'
export const config: IFormConfig = {
    fields: [
        {
            label: "references.language",
            key: "languageId",
            type: "select",
            refName: "language",
            validation: { required },
        },
        {
            label: "references.languageStatus",
            key: "languageStatusId",
            type: "select",
            refName: "language-status",
            validation: { required },
        },
       
    ]
}
export interface ILanguage {
    comment: string
    employeeFullName: string
    employeeId: string
    id: string
    languageId: string
    languageName: string
    languageStatusId: string
    languageStatusName: string
}
export const LanguageService = {
    getListAll(employeeId: string): AxiosPromise<ILanguage[]> {
        return ApiService.get(`${main}/list-employee-id/${employeeId}`)
    },
    create(data: any) {
        return ApiService.post(`${main}/create`, data)
    },
    update(data: any) {
        return ApiService.post(`${main}/update`, data)
    },
    delete(id: string) {
        return ApiService.delete(`${main}/delete/${id}`)
    }
}