"use client";

import { NavLinkAttr } from "@/components/ui/molecures/Nav";
import TabMenu from "@/components/ui/molecures/TabMenu";
import { useSearchParams } from "next/navigation";

export default function StatsTabMenu() {
  const searchParams = useSearchParams();
  const tlPeriodType = searchParams.get("tl") || "week";

  const tabMenuItems: NavLinkAttr[] = [
    {
      href: `/stats?tl=${tlPeriodType}&da=week`,
      content: "1 주",
    },
    {
      href: `/stats?tl=${tlPeriodType}&da=month`,
      content: "1 달",
    },
    {
      href: `/stats?tl=${tlPeriodType}&da=year`,
      content: "1 년",
    },
  ];

  return <TabMenu tabMenuItems={tabMenuItems} />;
}
