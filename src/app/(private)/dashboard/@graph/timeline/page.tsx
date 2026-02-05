import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";
import TimelineContainer from "./TimelineContainer";

export default async function DashboardTimeline() {
  const userid = await getUserIdByHeaders();

  return (
    <section>
      <TimelineContainer userid={userid} />
      <TimelineContainer userid={userid} searchRange="month" />
      <TimelineContainer userid={userid} searchRange="year" />
    </section>
  );
}
