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

type Props = {
  categories: Category[];
  subCategories: SubCategory[];
};

export default function SubCategoryDataTable({
  categories,
  subCategories,
}: Props) {
  const memoizedColumns = useMemo(
    () =>
      columnsFunc(columns, (rowData) => (
        <SubCategoryDetails categories={categories} data={rowData} />
      )),
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
