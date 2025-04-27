import { AxiosPromise } from "axios"
import ApiService from "../api"

const main = 'hrm-service/'
const main2 = 'hrm-service/employee-work'
export interface IEmployeeResume {
    academicDegreeTable: {
        educationalDegree: string
    }[]
    academicTitleTable: {
        academicTitle: string
    }[]
    awardTable: {
        award: string
    }[]
    birthDate: string
    birthPlace: string
    deputyTable: { deputy: string }[]
    educationTable: {
        education: string
        educationFinished: string
    }[]
    educationalDegreeTable: {
        educationalDegree: string
    }[]
    experienceTable: {
        experience: string
        experienceYear: string
    }[]
    familyMemberTable: {
        familyMember: string
        familyMemberAddress: string
        familyMemberBirthdayAndPlace: string
        familyMemberFio: string
        familyMemberWorkPlaceAndPosition: string
        familyMemberIsDead: boolean
        familyMemberComment: string
    }[]
    fio: string
    fromDateWork: string
    languageTable: { language: string }[]
    majorEducationTable: { educationMajor: string }[]
    nationality: string
    nowWork: string
    partial: {
        partial: string
    }
    rectalTable: {
        rectal: string
    }[]
    uploadPath: string
    address: string
    passportAddress: string
}

export const ResumeService = {
    getData(employeeId: string): AxiosPromise<IEmployeeResume> {
        return ApiService.get(`${main}/employee-resume/${employeeId}`)
    },
}