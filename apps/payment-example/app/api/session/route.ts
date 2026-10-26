import { NextRequest, NextResponse } from "next/server";
import { readEnvironment } from "@/lib/env";
import { admitRequest, errorResponse } from "@/lib/http";
import { ACCESS_LIFETIME_MS, createSessionToken, isSessionToken, SESSION_COOKIE } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const environment = readEnvironment();
    admitRequest(request, "session", environment.APP_ORIGIN);
    const existing = request.cookies.get(SESSION_COOKIE)?.value;
    const token = isSessionToken(existing) ? existing : createSessionToken();
    const response = new NextResponse(null, { status: 204, headers: { "Cache-Control": "private, no-store" } });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true, sameSite: "lax", path: "/", secure: new URL(environment.APP_ORIGIN).protocol === "https:", maxAge: ACCESS_LIFETIME_MS / 1000
    });
    return response;
  } catch (error) { return errorResponse(error); }
}
