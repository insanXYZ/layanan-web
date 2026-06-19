import { DeleteUser, UpdateUser } from "@/handlers/user-handler";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/users/[id]">,
) {
  const userId = (await ctx.params).id;
  return UpdateUser(req, userId);
}

export async function DELETE(
  _: NextRequest,
  ctx: RouteContext<"/api/users/[id]">,
) {
  const userId = (await ctx.params).id;
  return DeleteUser(userId);
}
