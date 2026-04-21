/**
 * 그래프 분류
 * 최근 1주일의 일별 투두 통계 : 라인 그래프
 * 완료된 투두 통계 : 라인 그래프
 * 투두의 타임라인(일별, 주별, 월별) : 병렬 라우팅을 이용한 밴드 그래프
 * 투두 생성부터 완료까지 걸린 시간 : 밴드 그래프
 */

export default function StatsLayout({
  timeline,
  children,
  dailyActive,
}: Readonly<{
  timeline: React.ReactNode;
  dailyActive: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <>
      <section className="flex flex-col gap-16 overflow-y-auto p-4 2xl:flex-row">
        {dailyActive}
        {timeline}
      </section>
      <section>{children}</section>
    </>
  );
}
