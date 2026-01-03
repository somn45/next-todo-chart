"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TabMenu() {
  const searchParams = useSearchParams();
  const daPeriodType = searchParams.get("da") || "week";
  return (
    <nav>
      <Link href={`/stats?tl=week&da=${daPeriodType}`}>1 주</Link>
      <Link href={`/stats?tl=month&da=${daPeriodType}`}>1 달</Link>
      <Link href={`/stats?tl=year&da=${daPeriodType}`}>1 년</Link>
    </nav>
  );
}
