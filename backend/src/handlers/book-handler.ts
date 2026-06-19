import { and, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import z, { number } from "zod";
import { db } from "@/db";
import {
  booksTable,
  borrowDetailsTable,
  borrowsTable,
  rackBooksTable,
} from "@/db/schema";
import { CreateBookRequest, UpdateBookRequest } from "@/dto/book-dto";
import { BookEntity } from "@/entities/book-entity";
import {
  getAbsoluteFilenameCoverBook,
  getFilename,
  saveBookCover,
} from "@/utils/file";
import { ResponseErr, ResponseOk } from "@/utils/http";

export async function CreateBook(req: NextRequest) {
  try {
    const formdata = await req.formData();

    const createBookRequest: z.infer<typeof CreateBookRequest> = {
      title: formdata.get("title") as string,
      image: formdata.get("image")
        ? (formdata.get("image") as File)
        : undefined,
      rack_id: formdata.get("rack_id")
        ? (formdata.get("rack_id") as string)
        : undefined,
      quantity: Number(formdata.get("quantity")),
    };

    const parsed = CreateBookRequest.parse(createBookRequest);

    await db.transaction(async (tx) => {
      let filename: string = "";
      let newBook: BookEntity = {
        title: parsed.title,
        quantity: parsed.quantity,
      };

      if (parsed.image) {
        const newFilename = getFilename(parsed.image);
        const absoluteFilename = getAbsoluteFilenameCoverBook(newFilename);
        newBook.image = absoluteFilename;
        filename = newFilename;
      }

      if (parsed.rack_id) {
        newBook.rack_id = Number(parsed.rack_id);
      }

      await tx.insert(booksTable).values(newBook);

      if (parsed.image) {
        await saveBookCover(parsed.image, filename);
      }
    });

    return ResponseOk(null, "sukses menyimpan buku");
  } catch (error) {
    return ResponseErr("gagal menyimpan buku.", error);
  }
}

export async function GetBooks(category: string | null) {
  try {
    const borrowedQtyExpr = sql<number>`
    COALESCE(
      SUM(
        CASE 
          WHEN ${borrowsTable.is_returned} = false 
          THEN ${borrowDetailsTable.quantity} 
          ELSE 0 
        END
      ), 
      0
    )
  `.mapWith(Number);

    const query = db
      .select({
        id: booksTable.id,
        title: booksTable.title,
        quantity: booksTable.quantity,
        image: booksTable.image,
        available_quantity:
          sql<number>`${booksTable.quantity} - ${borrowedQtyExpr}`.mapWith(
            Number,
          ),
        rack_id: booksTable.rack_id,
        rack_name: rackBooksTable.name,
        created_at: booksTable.created_at,
      })
      .from(booksTable)
      .leftJoin(rackBooksTable, eq(booksTable.rack_id, rackBooksTable.id))
      .leftJoin(
        borrowDetailsTable,
        eq(borrowDetailsTable.book_id, booksTable.id),
      )
      .leftJoin(
        borrowsTable,
        and(eq(borrowsTable.id, borrowDetailsTable.borrow_id)),
      )
      .groupBy(booksTable.id, booksTable.title, booksTable.quantity);

    if (category) {
      query.where(eq(rackBooksTable.name, category));
    }

    const books = await query;

    return ResponseOk(books, "sukses mendapatkan daftar buku.");
  } catch (error) {
    return ResponseErr("gagal mendapatkan buku.", error);
  }
}

export async function UpdateBook(req: NextRequest, bookId: string) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const image = formData.get("image");
    const rack_id = formData.get("rack_id");
    const quantity = formData.get("quantity");

    const payload = {
      title: title as string,
      rack_id: rack_id ? (rack_id as string) : undefined,
      image: image ? (image as File) : undefined,
      quantity: quantity ? parseInt(quantity as string) : undefined,
    };

    const parsed = UpdateBookRequest.safeParse(payload);

    if (!parsed.success) {
      throw parsed.error;
    }

    const data = parsed.data;

    await db.transaction(async (tx) => {
      const book = await tx
        .select()
        .from(booksTable)
        .where(eq(booksTable.id, Number(bookId)))
        .limit(1);

      if (book.length === 0) {
        throw new Error("buku tidak ditemukan");
      }

      const updateBook: Partial<BookEntity> = {
        title: data.title,
        quantity: data.quantity,
      };

      let filename: string | undefined;

      if (data.image) {
        filename = getFilename(data.image);
        updateBook.image = getAbsoluteFilenameCoverBook(filename);
      }

      if (data.rack_id) {
        updateBook.rack_id = Number(data.rack_id);
      }

      await tx
        .update(booksTable)
        .set(updateBook)
        .where(eq(booksTable.id, Number(bookId)));

      if (data.image && filename) {
        await saveBookCover(data.image, filename);
      }
    });

    return ResponseOk(null, "sukses memperbarui buku.");
  } catch (error) {
    return ResponseErr("gagal memperbarui buku.", error);
  }
}

export async function DeleteBook(bookId: string) {
  try {
    await db.delete(booksTable).where(eq(booksTable.id, Number(bookId)));
    return ResponseOk(null, "sukses menghapus buku.");
  } catch (error) {
    return ResponseErr("gagal menghapus buku.", error);
  }
}
