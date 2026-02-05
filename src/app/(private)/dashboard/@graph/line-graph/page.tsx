import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";
import LineGraphContainer from "./LineGraphContainer";

export default async function DashboardDailyActive() {
  const userid = await getUserIdByHeaders();

  return (
    <section>
      <LineGraphContainer userid={userid} />
      <LineGraphContainer userid={userid} searchRange="month" />
      <LineGraphContainer userid={userid} searchRange="year" />
    </section>
  );
}
