import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "./libs/database";
import { createJwtToken } from "./utils/createJwtToken";
import { setCookies } from "./utils/setCookies";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { WithId } from "mongodb";

interface Jwt {
  id: string; // userid
  exp: number;
}

interface User {
  userid: string;
  password: string;
  email: string;
  refreshToken: RequestCookie;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const response = NextResponse.next();

  const cookieStore = await cookies();
  if (url === "/login" || url === "/join") {
    return response;
  }

  const accessToken = cookieStore.get("atk") as RequestCookie;

  // accessToken이 없다면 로그아웃 및 로그인 페이지로 리다이렉트
  if (!accessToken) {
    request.cookies.delete("atk");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const accessTokenPayload: Jwt = JSON.parse(
    atob(accessToken.value.split(".")[1]),
  );
  const userid = accessTokenPayload.id;
  const db = (await connectDB).db("next-todo-chart-cluster");
  const user = (await db
    .collection("users")
    .findOne({ userid })) as WithId<User>;
  const { refreshToken } = user;

  // refreshToken이 없다면 로그아웃 및 로그인 페이지로 리다이렉트
  if (!refreshToken) {
    request.cookies.delete("atk");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isExpiredAccessToken = Date.now() > accessTokenPayload.exp * 1000;

  // accessToken 만료일자 판단
  if (isExpiredAccessToken) {
    const refreshTokenPayload: Jwt = JSON.parse(
      atob(refreshToken.value.split(".")[1]),
    );
    const isExpiredRefreshToken = Date.now() > refreshTokenPayload.exp * 1000;
    // refreshToken도 만료되었다면 로그아웃 및 페이지로 리다이렉트
    if (isExpiredRefreshToken) {
      request.cookies.delete("atk");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // refreshToken이 있다면 accessToken 재발급
    const { accessToken: newAccessToken } = createJwtToken(userid);
    console.log("만료된 accessToken 재발급");
    response.cookies.set({
      name: "atk",
      value: newAccessToken,
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
    });

    return response;
  }

  return response;
}

export const config = {
  runtime: "nodejs",
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|__tests__).*)",
  ],
};
