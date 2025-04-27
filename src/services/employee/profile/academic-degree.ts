import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/academic-degree'
export const config: IFormConfig = {
    fields: [
        {
            label: "references.academicDegree",
            key: "academicDegreeId",
            type: "select",
            refName: "academic-degree",
            validation: { required },
        },
        {
            label: "field.givenYear",
            key: "givenYear",
            type: "yearpicker",
            validation: { required },
        },
        {
            label: "field.comment",
            key: "comment",
            type: "textarea",
            validation: {},
        },

    ]
}
export interface IAcademicDegree {
    academicDegreeName: string
    givenYear: string
    employeeId: string
    id: string
    comment: string
}
export const AcademicDegreeService = {
    getListAll(employeeId: string): AxiosPromise<IAcademicDegree[]> {
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