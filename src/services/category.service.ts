import "server-only";
import { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";

class CategoryService {
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
