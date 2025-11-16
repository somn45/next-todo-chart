import Link from "next/link";

export default function StatsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <section>
        <nav>
          <ul>
            <li>
              <Link href="/stats">통계 개요</Link>
            </li>
            <li>
              <Link href="/stats/todos">완료된 투두 통계</Link>
            </li>
            <li>
              <Link href="/stats/calendar">투두리스트 캘린더</Link>
            </li>
          </ul>
        </nav>
      </section>
      <section>{children}</section>
    </>
  );
}
