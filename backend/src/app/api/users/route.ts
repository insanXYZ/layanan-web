import { CreateUser, GetUsers } from "@/handlers/user-handler";
import { DecodeJwt } from "@/utils/jwt";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const claims = DecodeJwt(req);
  return GetUsers(claims);
}

export async function POST(req: NextRequest) {
  return CreateUser(req);
}
