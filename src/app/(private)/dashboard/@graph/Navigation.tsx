"use client";

import TabMenu from "@/components/ui/molecules/TabMenu";
import useQueryString from "@/hooks/useQueryString";
import { NavLinkItem } from "@/types/ui";
import getTabMenuItems from "@/utils/ui/getTabMenuItems";
import { ChartGantt, ChartSpline } from "lucide-react";

const navLinkItems: NavLinkItem[] = [
  {
    href: "/dashboard/line-graph",
    content: <ChartSpline />,
    label: "라인 스파크라인 표시",
  },
  {
    href: "/dashboard/timeline",
    content: <ChartGantt />,
    label: "밴드 스파크라인 표시",
  },
];

export default function Navigation() {
  const url = useQueryString();
  return <TabMenu tabMenuItems={getTabMenuItems(navLinkItems, url)} />;
}
