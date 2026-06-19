import { DeleteBook, UpdateBook } from "@/handlers/book-handler";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/books/[id]">,
) {
  const bookId = (await ctx.params).id;

  return UpdateBook(req, bookId);
}

export async function DELETE(
  _: NextRequest,
  ctx: RouteContext<"/api/books/[id]">,
) {
  const bookId = (await ctx.params).id;

  return DeleteBook(bookId);
}
