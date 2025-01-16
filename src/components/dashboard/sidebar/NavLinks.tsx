"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { icons } from "@/constants/Icons";
import { useParams, usePathname } from "next/navigation";
import {
  adminDashboardSidebarOptions,
  sellerDashboardSidebarOptions,
} from "@/constants/data";
import { useMemo } from "react";

type Props = {
  // menuLinks: ISidebarMenuType[];
  isAdmin?: boolean;
};

export default function SidebarNavLink({ isAdmin }: Props) {
  const params = useParams<{ storeUrl: string }>();
  const menuLinks = useMemo(() => {
    return isAdmin
      ? adminDashboardSidebarOptions
      : sellerDashboardSidebarOptions;
  }, [isAdmin]);
  const pathname = usePathname();
  return (
    <nav className="relative grow">
      <Command className="rounded-lg overflow-visible bg-transparent">
        <CommandInput placeholder="...جستجو" />
        <CommandList className="py-2 overflow-visible">
          <CommandEmpty>لینکی یافت نشد</CommandEmpty>
          <CommandGroup className="overflow-visible pt-0 relative">
            {menuLinks.map(({ link, icon, label }, index) => {
              const Icon = icons[icon!];
              const urlLink = isAdmin
                ? link
                : params?.storeUrl
                  ? `/dashboard/seller/stores/${params?.storeUrl}${link ? `/${link}` : ""}`
                  : "";
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent": urlLink === pathname,
                  })}
                >
                  <Link
                    href={urlLink}
                    className="flex items-center gap-2 hover:bg-transparent rounded-md transition-all w-full"
                  >
                    {Icon && <Icon />}
                    <span>{label}</span>
                  </Link>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </nav>
  );
}
