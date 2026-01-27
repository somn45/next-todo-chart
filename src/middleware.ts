import { NextResponse, type NextRequest } from "next/server";
import { decodeJwtTokenPayload } from "./utils/decodeJwtTokenPayload";

interface Jwt {
  id: string; // userid
  exp: number;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  if (url === "/login" || url === "/join") {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("lc_at");

  // accessToken 만료일자 판단
  if (!accessToken) {
    const refreshToken = request.cookies.get("lc_rt");

    // refreshToken이 없다면 로그아웃 및 로그인 페이지로 리다이렉트
    if (!refreshToken) {
      request.cookies.delete("lc_at");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const refreshTokenPayload: Jwt = decodeJwtTokenPayload(refreshToken);
    const isExpiredRefreshToken = Date.now() > refreshTokenPayload.exp * 1000;
    const userid = refreshTokenPayload.id;

    // refreshToken도 만료되었다면 로그아웃 및 페이지로 리다이렉트
    if (isExpiredRefreshToken) {
      await fetch(`http://localhost:3000/api/token/refresh`, {
        method: "DELETE",
        body: JSON.stringify(userid),
      });
      request.cookies.delete("lc_at");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // refreshToken이 있다면 accessToken 재발급
    const { newAccessToken } = (await (
      await fetch("http://localhost:3000/api/token", {
        method: "POST",
        body: JSON.stringify(userid),
      })
    ).json()) as { newAccessToken: string };
    NextResponse.next().cookies.set({
      name: "lc_at",
      value: newAccessToken,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60,
    });
  } else {
    const { isVerify } = (await (
      await fetch("http://localhost:3000/api/token/verify", {
        method: "POST",
        body: JSON.stringify(accessToken.value),
      })
    ).json()) as { isVerify: true };

    // 토큰 변조 유무 확인
    if (!isVerify) {
      request.cookies.delete("lc_at");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|__tests__).*)",
  ],
};
