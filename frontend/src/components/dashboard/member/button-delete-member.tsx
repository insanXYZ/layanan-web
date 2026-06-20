import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MemberBorrowDto } from "@/dto/member-borrow-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function ButtonDeleteMember({
  member,
}: {
  member: MemberBorrowDto;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getMemberBorrows"],
    true,
  );

  const onClick = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/members/${member.id}`,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Trash width={20} height={20} />
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hapus</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Apakah kamu yakin menghapus member ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus member termasuk dengan riwayat peminjaman
            member ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <ButtonLoading isPending={isPending} onClick={onClick}>
            Hapus
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
