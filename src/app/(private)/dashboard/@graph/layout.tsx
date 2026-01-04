import Link from "next/link";

export default function DashboardGraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link href="/dashboard/line-graph">라인 그래프</Link>
        <Link href="/dashboard/timeline">타임라인</Link>
      </nav>
      {children}
    </div>
  );
}
