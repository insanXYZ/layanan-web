import { HandHelping, View } from "lucide-react";
import { DateTime } from "luxon";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BorrowDto } from "@/dto/borrow-dto";

export default function ButtonDetailBorrow({ borrow }: { borrow: BorrowDto }) {
  const [open, setOpen] = useState<boolean>(false);
  const status = () => {
    const isReturned = borrow.is_returned;
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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <View width={20} height={20} />
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Detail</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="w-2xl z-50" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            <HandHelping /> Detail Pinjaman
          </DialogTitle>
        </DialogHeader>
        <FieldGroup>
          <div className="p-6 pt-0 flex flex-col gap-5">
            <div className="w-full grid grid-cols-3 bg-white p-2 rounded-xl">
              <div className="flex flex-col">
                <p className="text-xl font-extrabold">{borrow.member.name}</p>
                <p>{borrow.member.phone_number}</p>
              </div>

              <div className="flex flex-col text-center">
                <p>Tanggal Dipinjam</p>
                <p>
                  {DateTime.fromISO(borrow.created_at.toString())
                    .setLocale("id")
                    .toFormat("yyyy LLLL dd")}
                </p>
              </div>
              <div className="flex flex-col text-center">
                <p>Tanggal Jatuh Tempo</p>
                <p>
                  {DateTime.fromISO(borrow.due_date.toString())
                    .setLocale("id")
                    .toFormat("yyyy LLLL dd")}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl">
              <div className="flex w-full justify-between p-2">
                <p className="text-xl font-extrabold">Detail Buku</p>
                {status()}
              </div>
              <Table>
                <TableHeader className="bg-[#C6CCDC] font-extrabold sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[20px]">No</TableHead>
                    <TableHead>Cover</TableHead>
                    <TableHead>Judul Buku</TableHead>
                    <TableHead>Rak</TableHead>
                    <TableHead>Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {borrow.borrow_details.map((d, i) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>
                        <Image
                          unoptimized
                          src={d.book.image!}
                          width={0}
                          height={0}
                          className="aspect-cover-book w-10 object-fill"
                          alt={d.book.title}
                        />
                      </TableCell>
                      <TableCell>{d.book.title}</TableCell>
                      <TableCell>{d.book.rack_id}</TableCell>
                      <TableCell>{d.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </FieldGroup>
      </DialogContent>
    </Dialog>
  );
}
