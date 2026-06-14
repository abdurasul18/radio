import ApiService, { createQuery } from "./api";
import { QueryType } from "./types";
import { IMake } from "./makes";

export interface IModel {
  id: number;
  make_id: number;
  name: string;
  slug: string;
  sort: number;
  status: number;
  make?: IMake;
}

export const ModelsService = {
  getList(query: QueryType) {
    return ApiService.get(`admin/vehicles/models?${createQuery(query)}`);
  },
  getOne(id: number) {
    return ApiService.get(`admin/vehicles/models/${id}`);
  },
  create(data: any) {
    return ApiService.post(`admin/vehicles/models/create`, data);
  },
  update(id: number, data: any) {
    return ApiService.post(`admin/vehicles/models/update/${id}`, data);
  },
  delete(id: number) {
    return ApiService.delete(`admin/vehicles/models/delete/${id}`);
  },
};
