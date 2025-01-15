"use client";

import { Category, SubCategory } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  SubCategoryFormSchema,
  SubCategoryFormSchemaType,
} from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/shared/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { upsertSubCategory } from "@/action/subcategory.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  categories: Category[];
  data?: SubCategory;
};

export default function SubCategoryDetails({ data, categories }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SubCategoryFormSchemaType>({
    mode: "onChange",
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      title: data?.title ?? "",
      featured: data?.featured ?? false,
      image: data?.image ?? null,
      url: data?.url ?? "",
      categoryId: data?.categoryId ?? "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  // useEffect(() => {
  //   if (data) {
  //     form.reset({
  //       title: data?.title,
  //       featured: data?.featured,
  //       image: data?.image,
  //       url: data?.url,
  //     });
  //   }
  // }, [data, form]);

  async function onSubmit(values: SubCategoryFormSchemaType) {
    const formData = new FormData();
    if (data?.id) {
      formData.append("id", data.id);
    }
    if (values?.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    formData.append("title", values.title);
    formData.append("url", values.url);
    formData.append("featured", values.featured.toString());
    formData.append("categoryId", values.categoryId);

    console.log(
      data?.image && data.image.length > 0,
      "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>",
    );
    console.log(values, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");

    const result = await upsertSubCategory(formData);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "خطا",
        description: result.error,
      });
      return;
    } else {
      toast({
        title: "نتیجه",
        description: "با موفقیت انجام شد",
      });
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/subCategories");
      }
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full text-right">
        <CardHeader>
          <CardTitle>اطلاعات زیرگروه دسته بندی</CardTitle>
          <CardDescription>
            در این فرم شما قادر هستید برای دسته بندی ها، زیر گروه تعریف کنید و
            آنها را مدیریت کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>عنوان</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="عنوان"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>دسته بندی</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isSubmitting || categories.length === 0}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="انتخاب دسته بندی"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => {
                            return (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>مسیر</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="/subcategory-url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md gap-[11px]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>ویژه</FormLabel>
                      <FormDescription>
                        با انتخاب این گزینه دسته بندی در صفحه اول ظاهر می شود
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>انتخاب عکس</FormLabel>
                    <FormControl>
                      <ImageUpload
                        type="standard"
                        onChange={(values) => {
                          field.onChange([...values]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                // disabled={isSubmitting}
              >
                {isSubmitting
                  ? "..."
                  : data?.id
                    ? "ذخیره دسته بندی"
                    : "ایجاد دسته بندی"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}
