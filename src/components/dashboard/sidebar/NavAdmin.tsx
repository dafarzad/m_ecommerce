"use client";

import { IDashboardSidebarMenu } from "@/lib/type";
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
import { usePathname } from "next/navigation";

type Props = {
  menuLinks: IDashboardSidebarMenu[];
};

export default function SidebarNavAdmin({ menuLinks }: Props) {
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
              return (
                <CommandItem
                  key={index}
                  className={cn("w-full h-12 cursor-pointer mt-1", {
                    "bg-accent": link === pathname,
                  })}
                >
                  <Link
                    href={link}
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
