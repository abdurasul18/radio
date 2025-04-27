import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
import { IFaculty } from "./faculty";
export interface IAcademicYear {
  id: string
  status: number
  title: string
}

export const EduYearService = {
  getList(query: QueryType): AxiosPromise<IResponse<IAcademicYear []>> {
    return ApiService.get(`academic-year/index?${createQuery(query)}`);
  },
 
};
