import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!api/cron|api/weather/fetch-and-store|_next/static|favicon.ico).*)",
  ],
};
