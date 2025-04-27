import { AxiosPromise } from "axios"
import ApiService from "./api"
import { IResponse } from "./types"
export interface IFacultyRating {
    id:string
    title:string
    total_rate:number
}
export interface IDirectionRating {
    id:string
    name:string
    total_rate:number
}
export interface ITeacherRating {
    degree_id:string 
    degree_name:string 
    first_name:string 
    id:string 
    last_name:string 
    middle_name:string 
    total_rate:number 
}
export const RatingService = {
    byFaculty(): AxiosPromise<IResponse<IFacultyRating[]>> {
        return ApiService.get('/rating/faculty')
    },
    byDirection(): AxiosPromise<IResponse<IDirectionRating[]>> {
        return ApiService.get('/rating/direction')
    },
    byTeacher(): AxiosPromise<IResponse<ITeacherRating[]>> {
        return ApiService.get('/rating/teacher')
    },
}