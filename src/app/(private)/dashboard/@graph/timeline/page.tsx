import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import { setTodoStats } from "@/apis/setTodoStats";
import TimelineContainer from "./TimelineContainer";

interface AccessTokenPayload {
  sub: string;
}

export default async function DashboardTimeline() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  await setTodoStats(userid);

  return (
    <section>
      <TimelineContainer userid={userid} />
      <TimelineContainer userid={userid} searchRange="month" />
      <TimelineContainer userid={userid} searchRange="year" />
    </section>
  );
}
