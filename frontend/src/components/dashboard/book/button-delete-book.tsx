import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
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
import { BookDto } from "@/dto/book-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";

export default function ButtonDeleteBook({ book }: { book: BookDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getBooks"],
    true,
  );

  const onClick = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/books/${book.id}`,
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
            <Trash className="text-red-500" width={20} height={20} />
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hapus</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Buku</AlertDialogTitle>
          <AlertDialogDescription>
            <p>Tindakan ini akan menghapus data buku secara permanen</p>

            <p>Apakah anda yakin ingin menghapus buku ini?</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <ButtonLoading
            className="bg-red-500 text-white"
            isPending={isPending}
            onClick={onClick}
          >
            Hapus
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
