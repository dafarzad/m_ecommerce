"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { BadgeCheck, BadgeMinus } from "lucide-react";
import React from "react";

import { SubCategoryWithCategoryType } from "@/lib/type";

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
