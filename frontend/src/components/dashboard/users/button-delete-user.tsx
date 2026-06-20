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
import { UserDto } from "@/dto/user-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function ButtonDeleteUser({ user }: { user: UserDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getUsers"],
    true,
  );

  const onClick = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/users/${user.id}`,
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
            Apakah kamu yakin menghapus akun ini?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini akan menghapus akun.
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
