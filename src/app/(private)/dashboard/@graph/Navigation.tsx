"use client";

import TabMenu from "@/components/ui/molecures/TabMenu";
import useQueryString from "@/hooks/useQueryString";
import { NavLinkItem } from "@/types/ui";
import getTabMenuItems from "@/utils/ui/getTabMenuItems";

const navLinkItems: NavLinkItem[] = [
  {
    href: "/dashboard/line-graph",
    content: "라인 그래프",
  },
  {
    href: "/dashboard/timeline",
    content: "타임라인",
  },
];

export default function Navigation() {
  const url = useQueryString();
  return <TabMenu tabMenuItems={getTabMenuItems(navLinkItems, url)} />;
}
