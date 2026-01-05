import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import LineGraphContainer from "./LineGraphContainer";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashboardDailyActive() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);
  return (
    <section>
      <LineGraphContainer userid={userid} />
      <LineGraphContainer userid={userid} searchRange="month" />
      <LineGraphContainer userid={userid} searchRange="year" />
    </section>
  );
}
