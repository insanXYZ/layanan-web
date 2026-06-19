import {
  CreateMember,
  GetMemberBorrows,
} from "@/handlers/member-borrow-handler";
import { NextRequest } from "next/server";

export async function GET() {
  return GetMemberBorrows();
}

export async function POST(req: NextRequest) {
  return CreateMember(req);
}
