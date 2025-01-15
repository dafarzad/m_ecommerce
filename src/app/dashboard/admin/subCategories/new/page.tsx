import SubCategoryDetails from "@/components/dashboard/forms/SubCategoryDetails";
import { getCategories } from "@/action/category.action";

export default async function AdminNewSubcategories() {
  const response = await getCategories({ pageSize: 1000 });

  return (
    <div className="w-full">
      <SubCategoryDetails categories={response.result?.data ?? []} />
    </div>
  );
}
