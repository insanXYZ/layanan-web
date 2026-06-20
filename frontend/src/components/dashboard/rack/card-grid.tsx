import { ShelvingUnit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GetRackResponse } from "@/dto/rack-dto";
import ButtonDeleteRack from "./button-delete-rack";
import ButtonEditRack from "./button-edit-rack";

export default function RackCardGrid({ data }: { data: GetRackResponse }) {
  const listBooks = data.books.length > 3 ? data.books.slice(0, 3) : data.books;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="grid w-full bg-aneh grid-cols-3 p-6">
        <div className="col-span-2 font-extrabold items-center gap-5 flex">
          <ShelvingUnit width={40} height={40} />
          <div className="flex flex-col">
            <p>Rak</p>
            <p>{data.name}</p>
          </div>
        </div>
        <div className="flex items-center">{data.total_book} buku</div>
      </div>
      <ul className=" list-disc pl-11 p-6 grow">
        {listBooks.map((b) => (
          <li key={b.title}>{b.title}</li>
        ))}
      </ul>
      <div className="flex px-6 py-3 justify-end gap-5 items-center">
        <Link href={`/library/rack/${data.name}`}>
          <Button className="bg-bungur text-white">Lihat Detail</Button>
        </Link>
        <ButtonEditRack rack={data} />
        <ButtonDeleteRack rack={data} />
      </div>
    </div>
  );
}
