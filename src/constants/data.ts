import { ISidebarMenuType } from "@/lib/type";

export const adminDashboardSidebarOptions: ISidebarMenuType[] = [
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
] as const;

export const sellerDashboardSidebarOptions: ISidebarMenuType[] = [
  {
    label: "داشبورد",
    icon: "dashboard",
    link: "",
  },
  {
    label: "سفارشات",
    icon: "order",
    link: "orders",
  },
  {
    label: "محصولات",
    icon: "products",
    link: "products",
  },
  {
    label: "موجودی",
    icon: "inventory",
    link: "inventory",
  },
  {
    label: "تخفیف ها",
    icon: "coupon",
    link: "coupons",
  },
  {
    label: "حمل و نقل",
    icon: "shipping",
    link: "shipping",
  },
  {
    label: "تنظیمات",
    icon: "settings",
    link: "settings",
  },
] as const;
