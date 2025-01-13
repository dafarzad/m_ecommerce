import * as z from "zod";

// category from schema
export const CategoryFromSchema = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .nonempty("عنوان دسته بندی الزامی است")
    .min(2, "عنوان دسته بندی باید حداقل دو کاراکتر باشد")
    .max(50, "عنوان دسته بندی باید حداکثر 50 کاراکتر باشد"),
  image: z.any(),
  url: z.string(),
  featured: z.any(),
});
