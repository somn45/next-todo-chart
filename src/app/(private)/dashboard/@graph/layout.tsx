import { NavLinkAttr } from "@/components/ui/molecures/Nav";
import TabMenu from "@/components/ui/molecures/TabMenu";

const tabMenuItems: NavLinkAttr[] = [
  {
    href: "/dashboard/line-graph",
    content: "라인 그래프",
  },
  {
    href: "/dashboard/timeline",
    content: "타임라인",
  },
];

export default function DashboardGraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TabMenu tabMenuItems={tabMenuItems} />
      {children}
    </div>
  );
}
