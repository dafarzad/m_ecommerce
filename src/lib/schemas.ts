import * as z from "zod";

// category from schema
export const CategoryFromSchema = z.object({
  title: z
    .string()
    .nonempty("عنوان دسته بندی الزامی است")
    .min(2, "عنوان دسته بندی باید حداقل دو کاراکتر باشد")
    .max(50, "عنوان دسته بندی باید حداکثر 50 کاراکتر باشد")
    .regex(/^[a-zA-Z0-9 ]+$/, "فقط حروف، اعداد و جای خالی مجاز است"),
  image: z.string().url("Invalid image URL format"),
  url: z.string(),
  featured: z.boolean().default(false),
});
