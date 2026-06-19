import { NextRequest } from "next/server";
import { CreateBook, GetBooks } from "@/handlers/book-handler";

export async function POST(req: NextRequest) {
  return CreateBook(req);
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category");

  return GetBooks(category);
}
