"use server";

import { IActionResponse, PaginatedResult, QueryOptions } from "@/lib/type";
import { SubCategoryFormSchema } from "@/lib/schemas";
import fileService from "@/services/file.service";
import { Category, SubCategory } from "@prisma/client";
import subcategoryService from "@/services/subcategory.service";
import categoryService from "@/services/category.service";

export async function upsertSubCategory(
  data: FormData,
): Promise<IActionResponse<SubCategory>> {
  console.log(data, "data form server <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  try {
    const formData = Object.fromEntries(data);
    // console.log(formData, "From Data");
    const parsed = SubCategoryFormSchema.safeParse(formData);
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

    const category = await categoryService.getById(parsed.data.categoryId);
    if (!category) {
      return {
        success: false,
        error: `دسته بندی با id ${parsed.data.categoryId} یافت نشد`,
      };
    }

    let subCategoryFromDb = null;

    if (parsed.data.id) {
      subCategoryFromDb = await subcategoryService.getById(parsed.data.id);

      if (!subCategoryFromDb) {
        return {
          success: false,
          error: "یافت نشد",
        };
      }

      if (parsed.data?.image) {
        fileService.deleteFile(subCategoryFromDb.image);
      }
    } else {
      const categoryExists = await subcategoryService.alreadyExists(
        parsed.data,
      );
      if (categoryExists) {
        return {
          success: false,
          error: "دسته بندی با عنوان یا مسیر مشابه قبلا موجود است",
        };
      }
    }

    console.log(parsed, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<2222 parsed");
    let savedPath = null;
    if (!parsed.data.id || (parsed.data.id && parsed.data.image)) {
      savedPath = await fileService.saveFile(parsed.data.image);
    }

    const result = await subcategoryService.Upsert({
      id: parsed.data?.id,
      title: parsed.data.title,
      featured: parsed.data.featured === "true",
      image: savedPath ?? subCategoryFromDb?.image,
      url: parsed.data.url,
      categoryId: parsed.data.categoryId,
    });

    // console.log(parsed);
    return {
      success: true,
      result,
    };
  } catch (error: any) {
    console.error(error?.stack);
    return {
      success: false,
      error: "something went wrong",
    };
  }
}

export async function getSubcategories(
  options: QueryOptions<>,
): Promise<IActionResponse<PaginatedResult<SubCategory>>> {
  try {
    console.log("heloooooooooooooooo");
    const result = await subcategoryService.getAll(options);
    result.data = result.data.map((subCategory) => {
      const image = fileService.relativePathToUrl(subCategory.image);
      return { ...subCategory, image };
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
export async function getSubcategoryById(
  id: string,
): Promise<IActionResponse<Category>> {
  try {
    const result = await subcategoryService.getById(id);
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
export async function deleteSubcategoryById(
  id: string,
): Promise<IActionResponse> {
  try {
    const subCategory = await subcategoryService.getById(id);
    if (!subCategory) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }
    const success = await subcategoryService.delete(subCategory.id);
    if (success) {
      fileService.deleteFile(subCategory.image);
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
