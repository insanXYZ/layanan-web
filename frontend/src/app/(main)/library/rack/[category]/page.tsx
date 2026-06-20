"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Book } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/ui/data-table";
import { GetBookResponse } from "@/dto/book-dto";
import { useQueryTanstack } from "@/hooks/use-tanstack";

const columnHelper = createColumnHelper<GetBookResponse>();

const columns: ColumnDef<GetBookResponse>[] = [
  columnHelper.display({
    id: "rowNumber",
    header: "No",
    cell: ({ row }) => {
      return <div>{row.index + 1}</div>;
    },
    enableSorting: false,
    enableHiding: false,
  }),
  {
    header: "Cover",
    cell: ({ row }) => {
      const book = row.original;
      return book.image ? (
        <Image
          unoptimized
          src={book.image}
          width={0}
          height={0}
          className="aspect-cover-book w-16 object-fill"
          alt={book.title}
        />
      ) : (
        <Book
          width={64}
          height={64}
          className="text-slate-500 aspect-cover-book w-16"
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: "Judul",
  },

  {
    accessorKey: "quantity",
    header: "Jumlah",
  },
  {
    accessorKey: "available_quantity",
    header: "Tersedia",
  },
];

export default function Page() {
  const params = useParams<{ category: string }>();

  const { data: dataBooks, isPending: isPendingBooks } = useQueryTanstack(
    ["getBooks"],
    `/books?category=${params.category}`,
  );

  return (
    <DataTable
      isPending={isPendingBooks}
      search={{
        isSearch: true,
        column: "title",
        placeholder: "cari buku",
      }}
      data={dataBooks?.data ? dataBooks?.data : []}
      columns={columns}
    />
  );
}
