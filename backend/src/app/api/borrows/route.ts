import { CreateBorrows, GetBorrowsHandler } from "@/handlers/borrow-handler";
import { NextRequest } from "next/server";

export async function GET() {
  return GetBorrowsHandler();
}

export async function POST(req: NextRequest) {
  return CreateBorrows(req);
}
