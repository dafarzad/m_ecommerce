import { Category } from "@prisma/client";
import { prisma } from "@/lib/prisma";

class CategoryService {
  async UpsertCategory(category: Category) {
    if (!category.id) {
      const categoryExists = await this.alreadyExists(category);
      if (categoryExists) {
        throw new Error("Category already exists, change the title or url");
      }
    }

    const categoryDetail = await prisma.category.upsert({
      where: {
        id: category.id,
      },
      update: category,
      create: category,
    });

    return categoryDetail;
  }

  async alreadyExists(category: Category) {
    const alreadyExists = await prisma.category.findFirst({
      where: {
        OR: [
          { title: category.title.toLowerCase() },
          { url: category.url.toLowerCase() },
        ],
      },
    });

    return alreadyExists !== null;
  }
}

export default new CategoryService();
