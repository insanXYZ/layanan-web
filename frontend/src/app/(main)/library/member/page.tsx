"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import ButtonCreateMember from "@/components/dashboard/member/button-create-member";
import ButtonDeleteMember from "@/components/dashboard/member/button-delete-member";
import ButtonEditMember from "@/components/dashboard/member/button-edit-member";
import { DataTable } from "@/components/ui/data-table";
import { MemberBorrowDto } from "@/dto/member-borrow-dto";
import { useQueryTanstack } from "@/hooks/use-tanstack";

const columnHelper = createColumnHelper<MemberBorrowDto>();

const columns: ColumnDef<MemberBorrowDto>[] = [
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
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "phone_number",
    header: "Nomor Hp",
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const member = row.original;

      return (
        <div className="flex items-center gap-2">
          <ButtonEditMember member={member} />
          <ButtonDeleteMember member={member} />
        </div>
      );
    },
  },
];

export default function Page() {
  const { data: dataCategories, isPending: isPendingCategories } =
    useQueryTanstack(["getMemberBorrows"], "/members");

  return (
    <DataTable
      isPending={isPendingCategories}
      topbar={<ButtonCreateMember withLabel={true} />}
      search={{
        isSearch: true,
        column: "name",
        placeholder: "cari member",
      }}
      data={dataCategories?.data ? dataCategories?.data : []}
      columns={columns}
    />
  );
}
