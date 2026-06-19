import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { booksTable, rackBooksTable } from "@/db/schema";
import {
  CreateRackRequest,
  GetRackResponse,
  UpdateRackRequest,
} from "@/dto/rack-dto";
import { RackEntity } from "@/entities/rack-entity";
import { ResponseErr, ResponseOk } from "@/utils/http";

export async function GetRack() {
  try {
    const racks = await db
      .select()
      .from(rackBooksTable)
      .leftJoin(booksTable, eq(rackBooksTable.id, booksTable.rack_id));

    const groupedRacksMap = racks.reduce<Record<number, GetRackResponse>>(
      (acc, row) => {
        const rackData = row.racks;
        const bookData = row.books;

        if (!rackData) return acc;

        if (!acc[rackData.id]) {
          acc[rackData.id] = {
            id: rackData.id,
            name: rackData.name,
            created_at: rackData.created_at,
            total_book: 0,
            books: [],
          };
        }

        if (bookData) {
          acc[rackData.id].books.push({
            title: bookData.title,
          });
          acc[rackData.id].total_book += 1;
        }

        return acc;
      },
      {},
    );

    const formattedRacks: GetRackResponse[] = Object.values(groupedRacksMap);

    return ResponseOk(formattedRacks, "sukses mendapatkan informasi rak buku.");
  } catch (error) {
    return ResponseErr("gagal mendapatkan informasi rak buku.", error);
  }
}

export async function CreateRack(req: NextRequest) {
  try {
    const json = await req.json();
    const body = CreateRackRequest.parse(json);

    const newRack: RackEntity = {
      name: body.name,
    };

    await db.insert(rackBooksTable).values(newRack);

    return ResponseOk(null, "sukses membuat rak.");
  } catch (error) {
    return ResponseErr("gagal membuat rak.", error);
  }
}

export async function UpdateRack(req: NextRequest, id: string) {
  try {
    const json = await req.json();
    const body = UpdateRackRequest.parse(json);

    const racks = await db
      .select()
      .from(rackBooksTable)
      .where(eq(rackBooksTable.id, Number(id)));

    if (!racks.length) {
      throw new Error("Rak tidak diketahui");
    }

    await db
      .update(rackBooksTable)
      .set({
        name: body.name,
      })
      .where(eq(rackBooksTable.id, Number(id)));

    return ResponseOk(null, "sukses memperbarui rak.");
  } catch (error) {
    return ResponseErr("gagal memperbarui rak.", error);
  }
}

export async function DeleteRack(id: string) {
  try {
    await db.delete(rackBooksTable).where(eq(rackBooksTable.id, Number(id)));
    return ResponseOk(null, "sukses menghapus rak.");
  } catch (error) {
    return ResponseErr("gagal menghapus rak.", error);
  }
}
