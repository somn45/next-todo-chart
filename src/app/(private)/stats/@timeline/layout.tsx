import Link from "next/link";
import TabMenu from "./TabMenu";

export default function TimeLineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TabMenu />
      {children}
    </div>
  );
}
