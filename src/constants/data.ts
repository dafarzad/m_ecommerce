import { IDashboardSidebarMenu } from "@/lib/type";

export const adminDashboardSidebarOptions: IDashboardSidebarMenu[] = [
  {
    label: "داشبورد",
    icon: "dashboard",
    link: "/dashboard/admin",
  },
  {
    label: "فروشگاه ها",
    icon: "store",
    link: "/dashboard/admin/stores",
  },
  {
    label: "سفارشات",
    icon: "order",
    link: "/dashboard/admin/orders",
  },
  {
    label: "دسته بندی ها",
    icon: "categories",
    link: "/dashboard/admin/categories",
  },
  {
    label: "زیر گروه دسته بندی ها",
    icon: "categories",
    link: "/dashboard/admin/subCategories",
  },
  {
    label: "تخفیف ها",
    icon: "coupon",
    link: "/dashboard/admin/coupons",
  },
];
