import TimelineContainer from "./TimelineContainer";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";

export default async function DashboardTimeline() {
  const userid = await getUserIdWithAccessToken();

  return (
    <section>
      <TimelineContainer userid={userid} />
      <TimelineContainer userid={userid} searchRange="month" />
      <TimelineContainer userid={userid} searchRange="year" />
    </section>
  );
}
