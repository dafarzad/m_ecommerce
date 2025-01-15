"use client";

import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import SubCategoryDetails from "@/components/dashboard/forms/SubCategoryDetails";
import {
  columns,
  columnsFunc,
} from "@/app/dashboard/admin/subCategories/new/columns";
import React, { useMemo } from "react";
import { Category, SubCategory } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { deleteSubcategoryById } from "@/action/subcategory.action";

type Props = {
  categories: Category[];
  subCategories: SubCategory[];
};

export default function SubCategoryDataTable({
  categories,
  subCategories,
}: Props) {
  const { toast } = useToast();
  const memoizedColumns = useMemo(
    () =>
      columnsFunc(
        columns,
        (rowData) => (
          <SubCategoryDetails categories={categories} data={rowData} />
        ),
        async (rowData) => {
          const response = await deleteSubcategoryById(rowData.id);
          if (response.success) {
            toast({
              title: "حذف",
              description: "با موفقیت انجام شد",
            });
          } else {
            toast({
              variant: "destructive",
              title: "حذف",
              description: response.error,
            });
          }
        },
      ),
    [categories],
  );

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          ایجاد زیر گروه
        </>
      }
      modalChildren={<SubCategoryDetails categories={categories ?? []} />}
      filterValue="name"
      data={subCategories}
      searchPlaceholder="جستجوی زیرگروه"
      columns={memoizedColumns}
    />
  );
}
