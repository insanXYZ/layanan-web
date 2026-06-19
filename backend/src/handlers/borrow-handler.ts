import { eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import { db } from "@/db";
import {
  booksTable,
  borrowDetailsTable,
  borrowsTable,
  feeTable,
  memberBorrowsTable,
} from "@/db/schema";
import { CreateBorrowRequest } from "@/dto/borrow-dto";
import { BorrowDetailEntity, BorrowEntity } from "@/entities/borrow-entity";
import { ResponseErr, ResponseOk } from "@/utils/http";
import { GetDayFromDate } from "@/utils/utils";

export async function GetBorrowsHandler() {
  try {
    const borrows = await db
      .select()
      .from(borrowsTable)
      .innerJoin(
        borrowDetailsTable,
        eq(borrowsTable.id, borrowDetailsTable.borrow_id),
      )
      .innerJoin(booksTable, eq(borrowDetailsTable.book_id, booksTable.id))
      .innerJoin(
        memberBorrowsTable,
        eq(memberBorrowsTable.id, borrowsTable.member_borrow_id),
      );

    const borrowsResponse = Object.values(
      borrows.reduce(
        (acc, { borrows, borrow_details, books, member_borrows }) => {
          if (!acc[borrows.id]) {
            acc[borrows.id] = {
              ...borrows,
              member: member_borrows,
              borrow_details: [],
            };
          }
          acc[borrows.id].borrow_details.push({
            ...borrow_details,
            book: books,
          });
          return acc;
        },
        {} as Record<number, any>,
      ),
    );

    return ResponseOk(borrowsResponse, "sukses mendapatkan data peminjaman");
  } catch (error) {
    return ResponseErr("gagal mendapatkan data peminjaman.", error);
  }
}

export async function CreateBorrows(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateBorrowRequest.parse(body);

    await db.transaction(async (tx) => {
      const newBorrowId = await tx
        .insert(borrowsTable)
        .values({
          member_borrow_id: parsed.member_borrow_id,
          due_date: DateTime.fromJSDate(parsed.due_date).toUTC().toJSDate(),
          returned_at: null,
          is_returned: false,
        })
        .$returningId();

      const newBorrowDetails: BorrowDetailEntity[] = parsed.borrow_details.map(
        (detail) => {
          return {
            borrow_id: newBorrowId[0].id,
            book_id: detail.book_id,
            quantity: detail.quantity,
          };
        },
      );

      await tx.insert(borrowDetailsTable).values(newBorrowDetails);
    });

    return ResponseOk(null, "sukses membuat pinjaman.");
  } catch (error) {
    return ResponseErr("gagal membuat pinjaman.", error);
  }
}

export async function CheckBorrow(borrowId: string) {
  try {
    const borrows = await db
      .select()
      .from(borrowsTable)
      .where(eq(borrowsTable.id, Number(borrowId)));

    if (!borrows) {
      throw new Error("Data peminjaman tidak diketahui.");
    }

    await db.transaction(async (tx) => {
      const isDue = borrows[0].due_date < DateTime.now().toJSDate();

      if (isDue) {
        await tx.insert(feeTable).values({
          borrow_id: Number(borrowId),
          price: BigInt(
            GetDayFromDate(DateTime.now().toJSDate(), borrows[0].due_date) *
              1000,
          ),
          user_id: borrows[0].member_borrow_id,
        });
      }

      await tx
        .update(borrowsTable)
        .set({
          is_returned: true,
          returned_at: DateTime.now().toJSDate(),
        })
        .where(eq(borrowsTable.id, Number(borrowId)));
    });

    return ResponseOk(null, "sukses melakukan pengembalian buku,");
  } catch (error) {
    return ResponseErr("gagal melakukan pengembalian buku.", error);
  }
}

export async function DeleteBorrow(borrowId: string) {
  try {
    await db.delete(borrowsTable).where(eq(borrowsTable.id, Number(borrowId)));
    return ResponseOk(null, "sukses menghapus peminjaman");
  } catch (error) {
    return ResponseErr("gagal menghapus peminjaman.", error);
  }
}
