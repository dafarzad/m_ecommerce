import "server-only";
import { Category, Prisma, SubCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  PaginatedResult,
  QueryOptions,
  SubCategoryWithCategoryType,
} from "@/lib/type";

class SubCategoryService {
  async getAll(
    options: QueryOptions<Prisma.SubCategoryDelegate>,
  ): Promise<PaginatedResult<SubCategoryWithCategoryType>> {
    const {
      page = 1,
      pageSize = 10,
      sortBy = "updatedAt",
      sortOrder = "asc",
      filters = {},
      search,
      searchFields = [],
    } = options;

    const skip = (page - 1) * pageSize;

    const where: Prisma.Enumerable<any> = {
      ...filters,
      ...(search && searchFields.length > 0
        ? {
            OR: searchFields.map((field) => ({
              [field]: { contains: search, mode: "insensitive" },
            })),
          }
        : {}),
    };

    const orderBy = sortBy ? { [sortBy]: sortOrder } : undefined;

    const [data, total] = await Promise.all([
      prisma.subCategory.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.subCategory.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getById(id: string): Promise<Category | null> {
    return prisma.subCategory.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    return (await prisma.subCategory.delete({ where: { id } })) !== null;
  }

  async Upsert(params: Partial<SubCategory>) {
    let subCategory = null;
    if (!params.id) {
      subCategory = await prisma.subCategory.create({
        data: {
          url: params.url?.trim().toLowerCase() || "",
          featured: params?.featured,
          image: params.image?.trim() || "",
          title: params.title?.trim().toLowerCase() || "",
          categoryId: params.categoryId,
          updatedAt: new Date(),
        },
      });
    } else {
      subCategory = await prisma.subCategory.update({
        where: {
          id: params.id,
        },
        data: {
          url: params.url?.trim().toLowerCase() || "",
          featured: params?.featured,
          image: params.image?.trim() || "",
          title: params.title?.trim().toLowerCase() || "",
          categoryId: params.categoryId,
          updatedAt: new Date(),
        },
      });
    }

    return subCategory;
  }

  async alreadyExists(param: Partial<SubCategory>) {
    const alreadyExists = await prisma.subCategory.findFirst({
      where: {
        OR: [
          { title: { equals: param.title, mode: "insensitive" } },
          { url: { equals: param.url, mode: "insensitive" } },
        ],
      },
    });

    return alreadyExists !== null;
  }
}

export default new SubCategoryService();
