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
import { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "@/components/shared/custom-modal";

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
