import ApiService, { createQuery } from "./api";
import { IFile, IResponse, QueryType } from "./types";

export interface IMakeImage {
  id: number;
  path: string;
  base_url: string;
}

export interface IMake {
  id: number;
  name: string;
  slug: string;
  image_id: number | null;
  image: IMakeImage | null;
  sort: number;
  status: number;
  models_count: number;
  sub_category_id: number | null;
  category: string;
}

export const MakesService = {
  getList(query: QueryType) {
    return ApiService.get(
      `admin/vehicles/makes?${createQuery(query)}&expand=image`,
    );
  },
  create(data: any) {
    return ApiService.post(`admin/vehicles/makes/create`, data);
  },
  update(id: number, data: any) {
    return ApiService.post(`admin/vehicles/makes/update/${id}`, data);
  },
  delete(id: number) {
    return ApiService.delete(`admin/vehicles/makes/delete/${id}`);
  },
};
