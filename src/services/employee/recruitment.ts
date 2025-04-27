import { AxiosPromise } from "axios"
import ApiService, { createQuery } from "../api"
import { ResAxiosType } from "../types"
const main = 'hrm-service/employee'
const main2 = 'hrm-service/employee-work'
export interface IEmployeeWithoutWork {
    address: string
    beginDate: string
    birthRegionId: string
    birthRegionName: string
    birthday: string
    email: string
    employeeFullName: string
    employeeWorkId: string
    firstName: string
    firstNameUz: string
    genderId: string
    genderName: string
    id: string
    inps: string
    interiorPhone: string
    lastName: string
    lastNameUz: string
    maritalStatusId: string
    maritalStatusName: string
    mobilePhone: string
    nationalityId: string
    nationalityName: string
    orderDate: string
    orderRegNumber: string
    parentName: string
    parentNameUz: string
    passportAddress: string
    passportEndDate: string
    passportGivenDate: string
    passportGivenWho: string
    passportNumber: string
    passportRegionId: string
    passportRegionName: string
    passportSerial: string
    passportTypeId: string
    passportTypeName: string
    photoBase64: string
    regionAddressId: string
    regionAddressName: string
    staffListId: string
    staffPositionId: string
    staffPositionName: string
    tableNumber: string
    uploadPath: string
    wageRate: string
}
export const RecruitmentService = {
    createNew(data: any) {
        return ApiService.post(`${main}/create`, data)
    },
    listWithoutWork(query?: any, body?: any): ResAxiosType<IEmployeeWithoutWork> {
        return ApiService.post(`${main}/list?${createQuery(query)}`, body)
    },
    getById(id: string):AxiosPromise<IEmployeeWithoutWork> {
        return ApiService.get(`${main}/get-by-id/${id}`)
    },
    accept(data: any) {
        let formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key])
        }
        return ApiService.formData(`${main2}/recruitment`, formData)
    }

}