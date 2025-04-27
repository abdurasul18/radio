import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-experience'
export const config: IFormConfig = {
    fields: [
        {
            key: 'localePosition',
            label: 'name',
            children: [
                {
                    key: 'lt',
                    label: 'position.lt',
                    type: 'textarea',
                    validation: { required },
                },
                {
                    key: 'uz',
                    label: 'position.uz',
                    type: 'textarea',
                    validation: { required },
                },
                {
                    key: 'ru',
                    label: 'position.ru',
                    type: 'textarea',
                    validation: { required },
                },
                {
                    key: 'en',
                    label: 'position.en',
                    type: 'textarea',
                    validation: { required },
                },
            ],
        
        },
        {
            label: "field.beginDate",
            key: "beginDate",
            type: "datepicker",
            validation: { required },
        },
        {
            label: "field.endDate",
            key: "endDate",
            type: "datepicker",

        },
        {
            label: "field.inSystem",
            key: "isOrganization",
            type: "checkbox",
            default: false

        }
    ]
}
export interface IExperiance {
    beginDate: string
    departmentId: string
    departmentName: string
    employeeFullName: string
    employeeId: string
    endDate: string
    id: string
    isOrganization: boolean
    organizationId: string
    organizationName: string
    position:string
    systemId: string
    systemName: string
}
export const ExperianceSerivce = {
    getListAll(employeeId: string): AxiosPromise<IExperiance[]> {
        return ApiService.get(`${main}/list-employee-id/${employeeId}`)
    },
    create(data: any) {
        return ApiService.post(`${main}/create`, data)
    },
    update(data: any) {
        return ApiService.put(`${main}/update`, data)
    },
    delete(id: string) {
        return ApiService.delete(`${main}/delete/${id}`)
    }
}