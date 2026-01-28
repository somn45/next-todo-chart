import { cookies } from "next/headers";
import { decodeJwtTokenPayload } from "../decodeJwtTokenPayload";

/**
 * 이후 작업 계획
 * userid, accessToken이 없을 때의 에러 핸들링
 */

const getUserIdWithAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("lc_at");

  if (!accessToken) {
    return "";
  }
  const { sub: userid } = decodeJwtTokenPayload(accessToken);

  if (!userid) {
    return "";
  }
  return userid;
};

export default getUserIdWithAccessToken;
