"use server";

import { IActionResponse, PaginatedResult, QueryOptions } from "@/lib/type";
import { CategoryFormSchema } from "@/lib/schemas";
import fileService from "@/services/file.service";
import categoryService from "@/services/category.service";
import { Category } from "@prisma/client";

export async function upsertCategory(data: FormData): Promise<IActionResponse> {
  try {
    const formData = Object.fromEntries(data);
    // console.log(formData, "From Data");
    const parsed = CategoryFormSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.message,
      };
    }

    if (!parsed.data.id && !parsed.data.image) {
      return {
        success: false,
        error: "عکس الزامی است",
      };
    }

    let categoryFromDb = null;

    if (parsed.data.id) {
      categoryFromDb = await categoryService.getById(parsed.data.id);

      if (!categoryFromDb) {
        return {
          success: false,
          error: "یافت نشد",
        };
      }

      if (parsed.data?.image) {
        fileService.deleteFile(categoryFromDb.image);
      }
    } else {
      const categoryExists = await categoryService.alreadyExists(parsed.data);
      if (categoryExists) {
        return {
          success: false,
          error: "دسته بندی با عنوان یا مسیر مشابه قبلا موجود است",
        };
      }
    }

    let savedPath = null;
    if (parsed.data.id || (!parsed.data.id && parsed.data.image)) {
      savedPath = await fileService.saveFile(parsed.data.image);
    }

    const result = await categoryService.Upsert({
      id: parsed.data?.id,
      title: parsed.data.title,
      featured: parsed.data.featured === "true",
      image: savedPath ?? categoryFromDb?.image,
      url: parsed.data.url,
    });

    // console.log(parsed);
    return {
      success: true,
    };
  } catch (error: any) {
    console.error(error?.stack);
    return {
      success: false,
      error: "something went wrong",
    };
  }
}

export async function getCategories(
  options: QueryOptions<>,
): Promise<IActionResponse<PaginatedResult<Category>>> {
  try {
    console.log("heloooooooooooooooo");
    const result = await categoryService.getAll(options);
    result.data = result.data.map((category) => {
      const image = fileService.relativePathToUrl(category.image);
      return { ...category, image };
    });
    return {
      success: true,
      result: result,
    };
  } catch (error: any) {
    console.log(error?.stack);
    return {
      success: false,
    };
  }
}

//get category by id
export async function getCategoryById(
  id: string,
): Promise<IActionResponse<Category>> {
  try {
    const result = await categoryService.getById(id);
    if (result === null) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }
    return {
      success: true,
      result: result,
    };
  } catch (error: any) {
    console.log(error?.stack);
    return {
      success: false,
      error: "something went wrong",
    };
  }
}

//delete category ....
export async function deleteCategoryById(id: string): Promise<IActionResponse> {
  try {
    const category = await categoryService.getById(id);
    if (!category) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }
    const success = await categoryService.delete(category.id);
    if (success) {
      fileService.deleteFile(category.image);
    }

    return {
      success,
    };
  } catch (error: any) {
    console.log(error?.stack);
    return {
      success: false,
      error: "something went wrong",
    };
  }
}
