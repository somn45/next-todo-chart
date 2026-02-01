"use client";

import TabMenu from "@/components/ui/molecules/TabMenu";
import useQueryString from "@/hooks/useQueryString";
import { NavLinkItem } from "@/types/ui";
import getTabMenuItems from "@/utils/ui/getTabMenuItems";
import { useSearchParams } from "next/navigation";

export default function StatsTabMenu() {
  const searchParams = useSearchParams();
  const daPeriodType = searchParams.get("da") || "week";

  const url = useQueryString();

  const navLinkItems: NavLinkItem[] = [
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

  return <TabMenu tabMenuItems={getTabMenuItems(navLinkItems, url)} />;
}
