import { AxiosPromise } from "axios";
import ApiService, { createQuery } from "./api";
import { IResponse, QueryType } from "./types";
export interface IDegree {
  id: string
  status: number
  name: string
  slug: string
}

export const DegreeService = {
  getList(query: QueryType): AxiosPromise<IResponse<IDegree[]>> {
    return ApiService.get(`degree/index?${createQuery(query)}`);
  },
 
};
