"use client";

import { Category, Store } from "@prisma/client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { StoreFormSchema, StoreFormSchemaType } from "@/lib/schemas";
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
import { upsertCategory } from "@/action/category.action";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  data?: Store;
};

export default function StoreDetails({ data }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<StoreFormSchemaType>({
    mode: "onChange",
    resolver: zodResolver(StoreFormSchema),
    defaultValues: {
      title: data?.title ?? "",
      description: data?.description ?? "",
      featured: data?.featured ?? false,
      logo: data?.logo ?? [],
      cover: data?.cover ?? [],
      url: data?.url ?? "",
      email: data?.email ?? "",
      phone: data?.phone ?? "",
      status: data?.status.toString(),
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

  async function onSubmit(values: StoreFormSchemaType) {
    console.log(values, "values<<<<<<<<<<<<<<<<<<<<<<<");
    const formData = new FormData();
    if (data?.id) {
      formData.append("id", data.id);
    }
    formData.append("title", values.title);
    if (values?.image && values?.image.length > 0) {
      formData.append("image", values.image[0]);
    }
    formData.append("url", values.url);
    formData.append("featured", values.featured.toString());

    const result = await upsertCategory(formData);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "خطا",
        description: result.error,
      });
      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categorie");
      }
    } else {
      toast({
        title: "نتیجه",
        description: "با موفقیت انجام شد",
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full text-right">
        <CardHeader>
          <CardTitle>اطلاعات فروشگاه</CardTitle>
          <CardDescription>فرم مدیریت اطلاعات فروشگاه</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>عنوان دسته بندی</FormLabel>
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
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>مسیر دسته بندی</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="/category-url"
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
                name="logo"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>انتخاب لوگو</FormLabel>
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
              />{" "}
              <FormField
                control={form.control}
                name="cover"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>انتخاب کاور</FormLabel>
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
