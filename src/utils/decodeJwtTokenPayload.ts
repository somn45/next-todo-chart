import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const decodeJwtTokenPayload = (jwtToken: RequestCookie | string) => {
  let incodedJwtToken: string;
  if (typeof jwtToken === "string") {
    incodedJwtToken = jwtToken;
  } else {
    incodedJwtToken = jwtToken.value;
  }
  const jwtTokenRegExp = /\w+\.\w+\.\w+/i;
  if (!jwtTokenRegExp.test(incodedJwtToken))
    throw new Error("올바르지 않은 JWT 토큰 형식입니다.");
  return JSON.parse(atob(incodedJwtToken.split(".")[1]));
};
