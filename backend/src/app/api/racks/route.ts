import { NextRequest } from "next/server";
import { CreateRack, GetRack } from "@/handlers/rack-handler";

export async function GET() {
  return GetRack();
}

export async function POST(req: NextRequest) {
  return CreateRack(req);
}
