import "server-only";
import { Category, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PaginatedResult, QueryOptions } from "@/lib/type";

class CategoryService {
  async getAll(
    options: QueryOptions<Prisma.CategoryDelegate>,
  ): Promise<PaginatedResult<Prisma.CategoryGetPayload<{}>>> {
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
      prisma.category.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
      }),
      prisma.category.count({ where }),
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
    return prisma.category.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<boolean> {
    return (await prisma.category.delete({ where: { id } })) !== null;
  }

  async Upsert(params: Partial<Category>) {
    let category = null;
    if (!params.id) {
      category = await prisma.category.create({
        data: {
          url: params.url?.trim().toLowerCase() || "",
          featured: params?.featured,
          image: params.image?.trim() || "",
          title: params.title?.trim().toLowerCase() || "",
          updatedAt: new Date(),
        },
      });
    } else {
      category = await prisma.category.update({
        where: {
          id: params.id,
        },
        data: {
          url: params.url?.trim().toLowerCase() || "",
          featured: params?.featured,
          image: params.image?.trim() || "",
          title: params.title?.trim().toLowerCase() || "",
          updatedAt: new Date(),
        },
      });
    }

    return category;
  }

  async alreadyExists(param: Partial<Category>) {
    const alreadyExists = await prisma.category.findFirst({
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

export default new CategoryService();
