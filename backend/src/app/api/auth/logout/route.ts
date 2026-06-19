import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "sukses keluar." });
  res.cookies.delete("X-ACC-TOKEN");
  return res;
}
