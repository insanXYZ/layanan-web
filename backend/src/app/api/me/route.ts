import { GetMeHandler, UpdateMeHandler } from "@/handlers/user-handler";
import { DecodeJwt } from "@/utils/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const claims = DecodeJwt(req);
  return GetMeHandler(req, claims);
}

export async function PUT(req: NextRequest) {
  const claims = DecodeJwt(req);
  return UpdateMeHandler(req, claims);
}
