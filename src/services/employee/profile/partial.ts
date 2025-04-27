import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-partial'
export const config: IFormConfig = {
    fields: [
        {
            label: "references.partyMembership",
            key: "partyMembershipId",
            type: "select",
            refName: "party-membership",
            validation: { required },
        },
        {
            label: "field.comment",
            key: "comment",
            type: "textarea",
            validation: {  },
        },
       
    ]
}
export interface IPartial {
   [key: string]: any
}
export const PartialService = {
    getListAll(employeeId: string): AxiosPromise<IPartial[]> {
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