import { DeleteMember, UpdateMember } from "@/handlers/member-borrow-handler";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  ctx: RouteContext<"/api/members/[id]">,
) {
  const memberId = (await ctx.params).id;
  return DeleteMember(memberId);
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/members/[id]">,
) {
  const memberId = (await ctx.params).id;
  return UpdateMember(req, memberId);
}
