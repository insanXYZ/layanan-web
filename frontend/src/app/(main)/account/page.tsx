"use client";

import ButtonCreateUser from "@/components/dashboard/users/button-create-user";
import ButtonDeleteUser from "@/components/dashboard/users/button-delete-user";
import ButtonEditUser from "@/components/dashboard/users/button-edit-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "@/components/ui/data-table";
import { UserDto } from "@/dto/user-dto";
import { useQueryTanstack } from "@/hooks/use-tanstack";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<UserDto>();

const columns: ColumnDef<UserDto>[] = [
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
    header: "Gambar",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Avatar>
          <AvatarImage src={user.image ? user.image : undefined} />
          <AvatarFallback>{user.name.toUpperCase().slice(0, 2)}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    header: "Aksi",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex gap-2 item-center">
          <ButtonEditUser user={user} />
          <ButtonDeleteUser user={user} />
        </div>
      );
    },
  },
];

export default function Page() {
  const { data: dataNews, isPending: isPendingNews } = useQueryTanstack(
    ["getUsers"],
    "/users",
  );

  return (
    <DataTable
      isPending={isPendingNews}
      topbar={
        <div className="flex gap-2">
          <ButtonCreateUser />
        </div>
      }
      search={{
        isSearch: true,
        column: "name",
        placeholder: "cari akun",
      }}
      data={dataNews?.data ? dataNews?.data : []}
      columns={columns}
    />
  );
}
