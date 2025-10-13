import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "./libs/database";
import { createJwtToken } from "./utils/createJwtToken";
import { setCookies } from "./utils/setCookies";

interface Jwt {
  id: string; // userid
  exp: number;
}

interface User {
  userid: string;
  password: string;
  email: string;
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  const cookieStore = await cookies();
  if (url === "/login" || url === "/join") {
    return NextResponse.next();
  }

  const accessToken = cookieStore.get("atk");
  if (!accessToken) return NextResponse.redirect("/login");
  const accessTokenPayload: Jwt = JSON.parse(
    atob(accessToken.value.split(".")[1]),
  );
  const isExpiredAccessToken = Date.now() > accessTokenPayload.exp * 1000;
  if (isExpiredAccessToken) {
    const userid = accessTokenPayload.id;
    const db = (await connectDB).db("next-todo-chart-cluster");
    const refreshToken = await db.collection<User>("users").findOne({ userid });
    if (!refreshToken) {
      request.cookies.delete("atk");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { accessToken } = createJwtToken(userid);
    await setCookies(accessToken, 1000 * 60 * 60 * 24 * 30);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|__tests__).*)",
  ],
};
