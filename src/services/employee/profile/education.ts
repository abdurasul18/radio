import { AxiosPromise } from "axios";
import ApiService from "../../api";
import { IFormConfig } from "/@src/components/form/UniversalForm2.vue";
import { required } from '@vuelidate/validators'

const main = 'hrm-service/employee-education'
export const config: IFormConfig = {
    fields: [
        {
            label: "references.educationIns",
            key: "institutionId",
            type: "select",
            refName: "education-institution",
            validation: { required },
        },       
        {
            label: "references.education",
            key: "educationId",
            type: "select",
            refName: "education",
            validation: { required },
        },
        {
            label: "references.specDiploma",
            key: "diplomaId",
            type: "select",
            refName: "directory-special-diploma",
            validation: { required },
        },
      
        {
            label: "references.educationType",
            key: "educationTypeId",
            type: "select",
            refName: "education-type",
            validation: { required },
        },
        {
            label: "field.beginDate",
            key: "beginYear",
            type: "datepicker",
            validation: { required },
        },
        {
            label: "field.endDate",
            key: "endYear",
            type: "datepicker",
            validation: { required },
        },
        {
            label: "field.comment",
            key: "comment",
            type: "textarea",
        },
        {
            label: "field.isAbroad",
            key: "isAbroad",
            type: "checkbox",
            default: false
        }
    ]
}
export interface IEducation {
    beginYear:string
    comment:string
    diplomaId:string
    diplomaName:string
    educationId:string
    educationName:string
    educationTypeId:string
    educationTypeName:string
    employeeFullName:string
    employeeId:string
    endYear:string
    fileExtension:string
    id:string
    institutionId:string
    institutionName:string
    isAbroad:boolean
    uploadPath:string
}
export const EducationService = {
    getListAll(employeeId: string): AxiosPromise<IEducation[]> {
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