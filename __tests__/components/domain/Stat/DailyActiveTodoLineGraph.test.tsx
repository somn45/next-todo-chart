import DailyActiveTodoLineGraph from "@/components/domain/Stat/DailyActiveTodoLineGraph";
import { render, screen } from "@testing-library/react";

describe("LineGraph", () => {
  it("LineGraph 컴포넌트에서 커스텀 훅에서 받은 svg가 렌더링된다.", () => {
    render(<DailyActiveTodoLineGraph stats={[]} />);

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();
  });
});
