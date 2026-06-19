import { DeleteBorrow } from "@/handlers/borrow-handler";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  ctx: RouteContext<"/api/borrows/[id]">,
) {
  const borrowId = (await ctx.params).id;
  return DeleteBorrow(borrowId);
}
