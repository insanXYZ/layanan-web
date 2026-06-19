import { LoginHandler } from "@/handlers/auth-handler";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return LoginHandler(request);
}
