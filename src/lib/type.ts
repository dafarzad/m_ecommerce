import { Prisma } from "@prisma/client";

export interface IDashboardSidebarMenu {
  label: string;
  icon: string;
  link: string;
}

export interface IActionResponse<T = void> {
  result?: T;
  success: boolean;
  error?: string | string[];
}

export interface QueryOptions<T> {
  page?: number;
  pageSize?: number;
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
  filters?: Partial<T>;
  search?: string;
  searchFields?: (keyof T)[];
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SubCategoryWithCategoryType = Prisma.SubCategoryGetPayload<{
  include: { category: true };
}>;
