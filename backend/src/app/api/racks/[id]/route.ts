import { DeleteRack, UpdateRack } from "@/handlers/rack-handler";
import { NextRequest } from "next/server";

export async function DELETE(
  _: NextRequest,
  ctx: RouteContext<"/api/racks/[id]">,
) {
  const rackId = (await ctx.params).id;
  return DeleteRack(rackId);
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/racks/[id]">,
) {
  const rackId = (await ctx.params).id;
  return UpdateRack(req, rackId);
}
