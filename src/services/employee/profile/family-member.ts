import { AxiosPromise } from "axios";
import ApiService from "../../api";

const main = 'hrm-service/employee-family-member'

export interface IFamilyMember {
    address: string
    addressRegionId: string
    addressRegionName: string
    birthRegionId: string
    birthRegionName: string
    birthday: string
    comment: string
    employeeFullName: string
    employeeId: string
    familyMemberId: string
    familyMemberName: string
    fio: string
    id: string
    isDead: string
    textInfoReason: string
    workType: string
}
export const FamilyMemberService = {
    getListAll(employeeId: string): AxiosPromise<IFamilyMember[]> {
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