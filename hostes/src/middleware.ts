import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    return NextResponse.next();
  } catch (err) {
    console.error("Token verify error:", err);
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/restaurant/:path*", "/admin/:path*"],
};
