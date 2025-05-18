import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { UserTypes } from "./types/user";

// Генерация ключа из секрета
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return new TextEncoder().encode(secret);
};

// Проверка JWT токена
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());

    return payload;
  } catch (error) {
    return null;
  }
}

// Основной middleware
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token")?.value;
  const { pathname } = request.nextUrl;

  // Публичные маршруты
  const publicRoutes = ["/auth", "/"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Проверка токена
  const user = token ? await verifyToken(token) : null;

  // Редирект на логин если нет токена
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Проверка роли для /admin/*
  if (pathname.startsWith("/admin") && user?.type !== UserTypes.admin) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/restaurant/:path*"],
};
