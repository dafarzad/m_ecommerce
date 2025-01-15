import { getSubcategories } from "@/action/subcategory.action";
import { getCategories } from "@/action/category.action";
import React from "react";
import SubCategoryDataTable from "@/components/dashboard/subCategory/SubcategoryDataTable";

export default async function AdminSubcategoriesPage() {
  const subCategoriesResponse = await getSubcategories({});

  if (!subCategoriesResponse.success) return null;

  const categoriesResponse = await getCategories({ pageSize: 1000 });

  return (
    <SubCategoryDataTable
      categories={categoriesResponse.result?.data ?? []}
      subCategories={subCategoriesResponse.result?.data ?? []}
    />
  );
}
