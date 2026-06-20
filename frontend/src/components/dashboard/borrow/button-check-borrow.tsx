import { AlertCircleIcon, BookCheck } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/button-loading";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BorrowDto } from "@/dto/borrow-dto";
import { HttpMethod, useMutationTanstack } from "@/hooks/use-tanstack";
import { GetDay } from "@/utils/utils";

export default function ButtonCheckBorrow({ borrow }: { borrow: BorrowDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const { mutate, isPending, isSuccess } = useMutationTanstack(
    ["getBorrows"],
    true,
  );

  const isDue =
    DateTime.now().toJSDate() >
    DateTime.fromISO(borrow.due_date.toString()).toJSDate();

  const totalBook = borrow.borrow_details.reduce<number>(
    (acc, curr) => (acc += curr.quantity),
    0,
  );

  const dueDay = GetDay(DateTime.now().toString(), borrow.due_date.toString());

  const onClick = () => {
    mutate({
      body: null,
      method: HttpMethod.PUT,
      url: `/borrows/${borrow.id}/check`,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <BookCheck width={20} height={20} />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Konfirmasi Pengembalian</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="w-lg">
        <DialogHeader className="bg-transparent pb-0">
          <DialogTitle className="text-black">
            Konfirmasi Pengembalian Buku
          </DialogTitle>
          <DialogDescription>
            Anda akan memproses pengembalian buku berikut:
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="p-6 pt-0">
          <FieldGroup>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-start align-top">
                    Judul Buku
                  </TableCell>
                  <TableCell>
                    <ol className="list-decimal pl-5">
                      <li>{borrow.borrow_details.map((i) => i.book.title)}</li>
                    </ol>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Nama Peminjam</TableCell>
                  <TableCell>: {borrow.member.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tanggal Pinjam</TableCell>
                  <TableCell>
                    :{" "}
                    {DateTime.fromISO(borrow.created_at.toString()).toFormat(
                      "yyyy LLL dd",
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tanggal Jatuh Tempo</TableCell>
                  <TableCell className={isDue ? "text-red-600" : ""}>
                    :{" "}
                    {DateTime.fromISO(borrow.due_date.toString()).toFormat(
                      "yyyy LLL dd",
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {isDue && dueDay != 0 && (
              <div className="flex flex-col gap-2">
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Pengembalian Terlambat {dueDay} Hari</AlertTitle>
                </Alert>

                <Alert className="flex justify-between  border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 ">
                  <div className="flex flex-col">
                    <p>Denda Keterlambatan</p>
                    <p>
                      Rp 1.000 x {dueDay} hari x {totalBook} buku
                    </p>
                  </div>
                  <div className="h-full flex items-center justify-center">
                    <div>Rp {1000 * dueDay * totalBook}</div>
                  </div>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle className="line-clamp-2">
                    Denda terhitung berdasarkan keterlambatan pengembalian.
                    Tarif denda: Rp1.000 per hari/buku.
                  </AlertTitle>
                </Alert>
              </div>
            )}

            <Separator />
            <div className="w-full text-center text-stone-500 font-bold">
              Apakah data sudah sesuai dan buku telah diterima?
            </div>
          </FieldGroup>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <ButtonLoading
              onClick={onClick}
              isPending={isPending}
              className="bg-bungur text-white"
            >
              Ya, Proses Pengembalian
            </ButtonLoading>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
