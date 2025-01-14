import { getCategories } from "@/action/category.action";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import CategoryDetails from "@/components/dashboard/forms/CategoryDetails";
import { columns } from "@/app/dashboard/admin/categories/new/columns";

export default async function AdminCategoriesPage() {
  const response = await getCategories({});

  console.log("response >>>>>>", response.result?.data);
  if (!response.success) return null;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          ایجاد دسته بندی
        </>
      }
      modalChildren={<CategoryDetails />}
      data={response.result!.data}
      columns={columns}
    />
  );
}
