import Link from "next/link";

export default function TimeLineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/stats/timeline/weekly">1 주</Link>
        <Link href="/stats/timeline/monthly">1 달</Link>
        <Link href="/stats/timeline/yearly">1 년</Link>
      </nav>
      {children}
    </div>
  );
}
