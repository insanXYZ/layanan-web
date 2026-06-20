"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DateTime } from "luxon";
import ButtonCheckBorrow from "@/components/dashboard/borrow/button-check-borrow";
import ButtonCreateBorrows from "@/components/dashboard/borrow/button-create-borrow";
import ButtonDeleteBorrow from "@/components/dashboard/borrow/button-delete-borrow";
import ButtonDetailBorrow from "@/components/dashboard/borrow/button-detail-borrow";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { GetBorrowResponse } from "@/dto/borrow-dto";
import { useQueryTanstack } from "@/hooks/use-tanstack";
import { FormatTimeToId } from "@/utils/time";

const columnHelper = createColumnHelper<GetBorrowResponse>();

const columns: ColumnDef<GetBorrowResponse>[] = [
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
    accessorKey: "member.name",
    header: "Nama",
    id: "member_name",
  },
  {
    header: "Tanggal Dipinjam",
    cell: ({ row }) => {
      const borrow = row.original;
      return FormatTimeToId(borrow.created_at.toString(), true);
    },
  },
  {
    header: "Tanggal jatuh tempo",
    cell: ({ row }) => {
      const borrow = row.original;
      return FormatTimeToId(borrow.due_date.toString(), true);
    },
  },
  {
    header: "Dikembalikan pada",
    cell: ({ row }) => {
      const borrow = row.original;
      return borrow.returned_at
        ? FormatTimeToId(borrow.returned_at.toString(), true)
        : "-";
    },
  },
  {
    header: "Status",
    cell: ({ row }) => {
      const borrow = row.original;
      const isReturned = borrow.is_returned;
      const isDue =
        DateTime.fromISO(borrow.due_date.toString()).setLocale("id") <
        DateTime.now();

      if (isReturned) {
        return (
          <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
            Dikembalikan
          </Badge>
        );
      } else if (isDue) {
        return (
          <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
            Terlambat
          </Badge>
        );
      } else {
        return (
          <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            Dipinjam
          </Badge>
        );
      }
    },
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const borrow = row.original;
      const isReturned = borrow.is_returned;

      return (
        <div className="flex gap-2">
          <ButtonDetailBorrow borrow={borrow} />
          <ButtonDeleteBorrow borrow={borrow} />
          {!isReturned && <ButtonCheckBorrow borrow={borrow} />}
        </div>
      );
    },
  },
];

export default function Page() {
  const { data: dataBorrows, isPending: isPendingBorrows } = useQueryTanstack(
    ["getBorrows"],
    "/borrows",
  );

  return (
    <DataTable
      isPending={isPendingBorrows}
      topbar={
        <div className="flex gap-2">
          <ButtonCreateBorrows />
        </div>
      }
      search={{
        isSearch: true,
        column: "member_name",
        placeholder: "cari peminjam",
      }}
      data={dataBorrows?.data ? (dataBorrows.data as GetBorrowResponse[]) : []}
      columns={columns}
    />
  );
}
