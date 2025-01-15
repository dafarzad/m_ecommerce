"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import { useModal } from "@/providers/modal-provider";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/shared/custom-modal";
import { deleteCategoryById, getCategoryById } from "@/action/category.action";
import { SubCategoryWithCategoryType } from "@/lib/type";

export function columnsFunc<T>(
  columns: ColumnDef<T>[],
  modalContent: (rowData: T) => React.ReactNode,
): ColumnDef<T>[] {
  const action = {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return <CellActions<T> rowData={rowData} modalContent={modalContent} />;
    },
  };
  const actionExists = columns[columns.length - 1].id === "actions";
  if (actionExists) {
    columns[columns.length - 1] = action;
  } else {
    columns.push(action);
  }

  return columns;
}

export const columns: ColumnDef<SubCategoryWithCategoryType>[] = [
  {
    accessorKey: "image",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="relative h-44 min-w-24 rounded-xl overflow-hidden">
          <Image
            src={row.original.image}
            alt=""
            width={1000}
            height={1000}
            className="w-40 h-40 rounded-full object-cover shadow-2xl"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "عنوان",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.title}
        </span>
      );
    },
  },
  {
    accessorKey: "url",
    header: "مسیر",
    cell: ({ row }) => {
      return <span>{row.original.url}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "دسته بندی",
    cell: ({ row }) => {
      return <span>{row.original.category.title}</span>;
    },
  },
  {
    accessorKey: "featured",
    header: "ویژه",
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground flex justify-start">
          {row.original.featured ? (
            <BadgeCheck className="stroke-green-300" />
          ) : (
            <BadgeMinus />
          )}
        </span>
      );
    },
  },
];

type CellActionsProps<T> = {
  rowData: T;
  modalContent: (rowData: T) => React.ReactNode;
};

function CellActions<T>({ rowData, modalContent }: CellActionsProps<T>) {
  const { setClose, setOpen } = useModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  if (!rowData) return null;

  return (
    <AlertDialog>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen?.(
                <CustomModal>{modalContent(rowData)}</CustomModal>,
                async () => {
                  return {
                    // rowData: await getCategoryById(rowData?.id),
                  };
                },
              );
            }}
          >
            <Edit size={15} />
            ویرایش
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} />
              حذف
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            آیا شما کاملا مطمئنید ؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            در صورت تایید اطلاعات شما برای همیشه حذف خواهد شد
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">انصراف</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              const response = await deleteCategoryById(rowData.id);
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
              setLoading(false);
              router.refresh();
              setClose?.();
            }}
          ></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
