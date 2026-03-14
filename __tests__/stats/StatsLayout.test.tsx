import StatsLayout from "@/app/(private)/stats/layout";
import { render, screen } from "@testing-library/react";

describe("Stats Layout", () => {
  it("dailyActive 슬롯, timeline 슬롯 모두 페이지에 렌더링된다.", async () => {
    const { container } = render(
      <StatsLayout
        timeline={<div data-testid="timeline-slot">타임라인 슬롯</div>}
        dailyActive={
          <div data-testid="daily-active-slot">
            활성화된 일일 투두 합계 슬롯
          </div>
        }
      >
        <div data-testid="stats-page">통계 페이지</div>
      </StatsLayout>,
    );

    expect(container).toMatchInlineSnapshot(`
<div>
  <section
    style="display: flex; gap: 50px;"
  >
    <div
      data-testid="daily-active-slot"
    >
      활성화된 일일 투두 합계 슬롯
    </div>
    <div
      data-testid="timeline-slot"
    >
      타임라인 슬롯
    </div>
  </section>
  <section>
    <div
      data-testid="stats-page"
    >
      통계 페이지
    </div>
  </section>
</div>
`);
  });
});
