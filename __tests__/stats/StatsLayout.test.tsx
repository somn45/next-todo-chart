import StatsLayout from "@/app/(private)/stats/layout";
import { render, screen } from "@testing-library/react";

describe("Stats Layout", () => {
  it("dailyActive 슬롯, timeline 슬롯 모두 페이지에 렌더링된다.", async () => {
    render(
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

    const timelineSlot = screen.getByTestId("timeline-slot");
    const dailyActiveSlot = screen.getByTestId("daily-active-slot");
    const statsPage = screen.getByTestId("stats-page");

    expect(timelineSlot).toBeInTheDocument();
    expect(dailyActiveSlot).toBeInTheDocument();
    expect(statsPage).toBeInTheDocument();
  });
});
