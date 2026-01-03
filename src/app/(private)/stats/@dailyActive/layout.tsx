import Link from "next/link";

export default function DailyActiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/stats/daily-active/weekly">1 주</Link>
        <Link href="/stats/daily-active/monthly">1 달</Link>
        <Link href="/stats/daily-active/yearly">1 년</Link>
      </nav>
      {children}
    </div>
  );
}
