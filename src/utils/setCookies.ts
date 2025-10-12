import { cookies } from "next/headers";

export const setCookies = async (cookieValue: string, maxAge: number) => {
  const cookieStore = await cookies();
  cookieStore.set("atk", cookieValue, {
    maxAge,
    httpOnly: true,
  });
};
