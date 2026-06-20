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
import { RackDto } from "@/dto/rack-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";

export default function ButtonDeleteRack({ rack }: { rack: RackDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getRacks"],
    true,
  );

  const onClick = () => {
    mutate({
      body: null,
      method: HttpMethod.DELETE,
      url: `/racks/${rack.id}`,
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
            <Trash className="text-red-600" width={20} height={20} />
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hapus</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Rak?</AlertDialogTitle>
          <AlertDialogDescription>
            Data rak akan dihapus secara permanen dan tidak dapat dikembalikan.
            Apakah anda yakin ingin menghapus rak ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <ButtonLoading
            isPending={isPending}
            onClick={onClick}
            className="text-white bg-red-600"
          >
            Hapus
          </ButtonLoading>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
