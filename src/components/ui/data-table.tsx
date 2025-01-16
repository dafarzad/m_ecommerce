"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { ReactNode, useState } from "react";
import { Edit, MoreHorizontal, Search, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/shared/custom-modal";
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  actionButtonText?: ReactNode;
  searchPlaceholder?: string;
  filterValue: string;
  heading?: string;
  subheading?: string;
  modalChildren?: ReactNode;
}

type CellActionsProps<T> = {
  rowData: T;
  modalContent: (rowData: T) => React.ReactNode;
  onDelete: (rowData: T) => void;
};

function CellActions<T>({
  rowData,
  modalContent,
  onDelete,
}: CellActionsProps<T>) {
  const { setClose, setOpen } = useModal();
  const [loading, setLoading] = useState(false);

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
              onDelete(rowData);
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

export function columnsFunc<T>(
  columns: ColumnDef<T>[],
  modalContent: (rowData: T) => React.ReactNode,
  onDelete: (rowData: T) => void,
): ColumnDef<T>[] {
  const action = {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <CellActions<T>
          rowData={rowData}
          modalContent={modalContent}
          onDelete={onDelete}
        />
      );
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

export function DataTable<TData, TValue>({
  columns,
  data,
  heading,
  subheading,
  modalChildren,
  actionButtonText,
  filterValue,
  searchPlaceholder = "جستجو",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const { setOpen } = useModal();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center py-4 gap-2">
          <Search />
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(filterValue)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterValue)?.setFilterValue(event.target.value)
            }
            className="h-12"
          />
        </div>
        {modalChildren && (
          <Button
            className="flex gap-2"
            onClick={() => {
              if (modalChildren) {
                console.log();
                setOpen?.(
                  <CustomModal
                    heading={heading || ""}
                    subheading={subheading || ""}
                  >
                    {modalChildren}
                  </CustomModal>,
                );
              }
            }}
          >
            {actionButtonText}
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table dir="rtl">
          <TableHeader className="text-right" dir="rtl">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} dir="rtl">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-right" dir="rtl">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody dir="rtl">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  dir="rtl"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} dir="rtl">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="rtl">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
