import LineGraphContainer from "./LineGraphContainer";
import getUserIdWithAccessToken from "@/utils/auth/getUserIdWithAccessToken";

export default async function DashboardDailyActive() {
  const userid = await getUserIdWithAccessToken();

  return (
    <section>
      <LineGraphContainer userid={userid} />
      <LineGraphContainer userid={userid} searchRange="month" />
      <LineGraphContainer userid={userid} searchRange="year" />
    </section>
  );
}
