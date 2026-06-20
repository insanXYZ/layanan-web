import { NextRequest, NextResponse } from "next/server";

export async function ClientMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("X-ACC-TOKEN")?.value;

  const publicPaths = ["/login"];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
