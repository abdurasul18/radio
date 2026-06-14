import ApiService, { createQuery } from "./api";
import { QueryType } from "./types";

export interface ISubcategory {
  id: number;
  category: string;
  name: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  status: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export const SubcategoryService = {
  getList(query: QueryType) {
    return ApiService.get(`admin/listings/subcategories?${createQuery(query)}`);
  },
  getOne(id: number) {
    return ApiService.get(`admin/listings/subcategories/${id}`);
  },
  create(data: any) {
    return ApiService.post(`admin/listings/subcategories/create`, data);
  },
  update(id: number, data: any) {
    return ApiService.post(`admin/listings/subcategories/update/${id}`, data);
  },
  delete(id: number) {
    return ApiService.delete(`admin/listings/subcategories/delete/${id}`);
  },
};
