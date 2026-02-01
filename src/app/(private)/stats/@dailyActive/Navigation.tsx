"use client";

import TabMenu from "@/components/ui/molecules/TabMenu";
import useQueryString from "@/hooks/useQueryString";
import { NavLinkItem } from "@/types/ui";
import getTabMenuItems from "@/utils/ui/getTabMenuItems";
import { useSearchParams } from "next/navigation";

export default function StatsTabMenu() {
  const searchParams = useSearchParams();
  const tlPeriodType = searchParams.get("tl") || "week";

  const url = useQueryString();

  const navLinkItems: NavLinkItem[] = [
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

  return <TabMenu tabMenuItems={getTabMenuItems(navLinkItems, url)} />;
}
