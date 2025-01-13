"use server";

import { IActionResponse } from "@/lib/type";
import { CategoryFromSchema } from "@/lib/schemas";
import fileService from "@/services/file.service";
import categoryService from "@/services/category.service";

export async function upsertCategory(data: FormData): Promise<IActionResponse> {
  try {
    const formData = Object.fromEntries(data);
    // console.log(formData, "From Data");
    const parsed = CategoryFromSchema.safeParse(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.message,
      };
    }
    const savedpath = await fileService.saveFile(parsed.data.image);

    const result = await categoryService.UpsertCategory({
      id: parsed.data?.id,
      title: parsed.data.title,
      featured: parsed.data.featured === "true",
      image: savedpath,
      url: parsed.data.url,
    });

    // console.log(parsed);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error(error?.stack);
    return {
      success: false,
      error: "something went wrong",
    };
  }
}
