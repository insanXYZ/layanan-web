import { VerifyJwt } from "@/utils/jwt";
import { HTTP_METHODS } from "next/dist/server/web/http";
import { NextRequest, NextResponse } from "next/server";

const isPublicApi = ["/api/auth/login"];

export async function ApiMiddleware(req: NextRequest) {
  if (req.method === HTTP_METHODS[2]) {
    return NextResponse.json(null, {
      status: 200,
    });
  }

  const { pathname } = req.nextUrl;
  const token = req.cookies.get("X-ACC-TOKEN")?.value;

  if (!isPublicApi.includes(pathname) && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!token) {
    return NextResponse.next();
  }

  const payload = await VerifyJwt(token);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-payload", JSON.stringify(payload));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
