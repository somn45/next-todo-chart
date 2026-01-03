"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function TabMenu() {
  const searchParams = useSearchParams();
  const tlPeriodType = searchParams.get("tl") || "week";
  return (
    <nav>
      <Link href={`/stats?tl=${tlPeriodType}&da=week`}>1 주</Link>
      <Link href={`/stats?tl=${tlPeriodType}&da=month`}>1 달</Link>
      <Link href={`/stats?tl=${tlPeriodType}&da=year`}>1 년</Link>
    </nav>
  );
}
