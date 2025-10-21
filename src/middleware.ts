import { NextResponse, type NextRequest } from "next/server";

interface Jwt {
  id: string; // userid
  exp: number;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  if (url === "/login" || url === "/join") {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("atk");
  // accessToken이 없다면 로그아웃 및 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const accessTokenPayload: Jwt = JSON.parse(
    atob(accessToken.value.split(".")[1]),
  );
  const userid = accessTokenPayload.id;
  const isExpiredAccessToken = Date.now() > accessTokenPayload.exp * 1000;

  // accessToken 만료일자 판단
  if (isExpiredAccessToken) {
    const { refreshToken } = (await (
      await fetch(`http://localhost:3000/api/token/refresh?userid=${userid}`)
    ).json()) as { refreshToken: string };

    // refreshToken이 없다면 로그아웃 및 로그인 페이지로 리다이렉트
    if (!refreshToken) {
      request.cookies.delete("atk");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const refreshTokenPayload: Jwt = JSON.parse(
      atob(refreshToken.split(".")[1]),
    );
    const isExpiredRefreshToken = Date.now() > refreshTokenPayload.exp * 1000;

    // refreshToken도 만료되었다면 로그아웃 및 페이지로 리다이렉트
    if (isExpiredRefreshToken) {
      await fetch(`http://localhost:3000/api/token/refresh`, {
        method: "DELETE",
        body: JSON.stringify(userid),
      });
      request.cookies.delete("atk");
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
      name: "atk",
      value: newAccessToken,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|__tests__).*)",
  ],
};
