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
      sortBy,
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

  async getCategoryById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async deleteCategory(id: string): Promise<boolean> {
    return (await prisma.category.delete({ where: { id } })) !== null;
  }

  async UpsertCategory(category: Partial<Category>) {
    if (!category.id) {
      const categoryExists = await this.alreadyExists(category);
      if (categoryExists) {
        throw new Error("Category already exists, change the title or url");
      }

      await prisma.category.create({
        data: {
          url: category.url?.trim().toLowerCase() || "",
          featured: category?.featured,
          image: category.image || "",
          title: category.title?.trim().toLowerCase() || "",
          updatedAt: new Date(), // Optional as above
        },
      });
    } else {
      await prisma.category.update({
        where: {
          id: category.id,
        },
        data: {
          url: category.url?.trim().toLowerCase() || "",
          featured: category?.featured,
          image: category.image || "",
          title: category.title?.trim().toLowerCase() || "",
          updatedAt: new Date(), // Optional as above
        },
      });
    }

    return true;
  }

  async alreadyExists(category: Partial<Category>) {
    const alreadyExists = await prisma.category.findFirst({
      where: {
        OR: [
          { title: { equals: category.title, mode: "insensitive" } },
          { url: { equals: category.url, mode: "insensitive" } },
        ],
      },
    });

    return alreadyExists !== null;
  }
}

export default new CategoryService();
