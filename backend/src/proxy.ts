import { ApiMiddleware } from "@/middleware/api-middleware";
import { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  return ApiMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|public|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|mp4|mp3|pdf|woff|woff2|ttf|otf)).*)",
  ],
};
