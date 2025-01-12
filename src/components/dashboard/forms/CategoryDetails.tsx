"use client";

import { Category } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { CategoryFromSchema } from "@/lib/schemas";
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

type Props = {
  data?: Category;
};

export default function CategoryDetails({ data }: Props) {
  const form = useForm<z.infer<typeof CategoryFromSchema>>({
    mode: "onChange",
    resolver: zodResolver(CategoryFromSchema),
    defaultValues: {
      title: data?.title,
      featured: data?.featured,
      image: data?.image,
      url: data?.url,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        title: data?.title,
        featured: data?.featured,
        image: data?.image,
        url: data?.url,
      });
    }
  }, [data, form]);

  async function onSubmit(values: z.infer<typeof CategoryFromSchema>) {
    console.log(values);
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>اطلاعات دسته بندی</CardTitle>
          <CardDescription>
            {data?.id ? `ویرایش دسته بندی ${data?.title}` : "افزودن دسته بندی"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>عنوان دسته بندی</FormLabel>
                    <FormControl>
                      <Input placeholder="عنوان" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>مسیر دسته بندی</FormLabel>
                    <FormControl>
                      <Input placeholder="/category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmitting}
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md gap-[11px]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                disabled={isSubmitting}
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>انتخاب عکس</FormLabel>
                    <FormControl>
                      <ImageUpload type="cover" onChange={() => {}} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
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
