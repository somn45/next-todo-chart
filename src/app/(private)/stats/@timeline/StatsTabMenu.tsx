"use client";

import { NavLinkAttr } from "@/components/ui/molecures/Nav";
import TabMenu from "@/components/ui/molecures/TabMenu";
import { useSearchParams } from "next/navigation";

export default function StatsTabMenu() {
  const searchParams = useSearchParams();
  const daPeriodType = searchParams.get("da") || "week";

  const tabMenuItems: NavLinkAttr[] = [
    {
      href: `/stats?tl=week&da=${daPeriodType}`,
      content: "1 주",
    },
    {
      href: `/stats?tl=month&da=${daPeriodType}`,
      content: "1 달",
    },
    {
      href: `/stats?tl=year&da=${daPeriodType}`,
      content: "1 년",
    },
  ];

  return <TabMenu tabMenuItems={tabMenuItems} />;
}
