import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";
import { render, screen } from "@testing-library/react";

describe("DAT 그래프 컴포넌트", () => {
  it("Linegraph 클래스에서 그래프 요소가 포함된 svg를 받아 svg가 렌더링된다.", () => {
    const { unmount, container } = render(
      <DailyActiveTodoLineGraph stats={[]} />,
    );

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();

    unmount();

    expect(container.innerHTML).toBe("");
  });
});
