import { CheckBorrow } from "@/handlers/borrow-handler";
import { NextRequest } from "next/server";

export async function PUT(
  _: NextRequest,
  ctx: RouteContext<"/api/borrows/[id]/check">,
) {
  const borrowId = (await ctx.params).id;
  return CheckBorrow(borrowId);
}
