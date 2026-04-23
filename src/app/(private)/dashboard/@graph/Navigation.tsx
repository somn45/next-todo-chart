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
  },
  {
    href: "/dashboard/timeline",
    content: <ChartGantt />,
  },
];

export default function Navigation() {
  const url = useQueryString();
  return <TabMenu tabMenuItems={getTabMenuItems(navLinkItems, url)} />;
}
