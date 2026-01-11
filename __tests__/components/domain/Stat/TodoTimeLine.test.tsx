import TodoTimeline from "@/components/domain/Stat/TodoTimeline";
import { render, screen } from "@testing-library/react";

describe("TodoTimeline 컴포넌트", () => {
  it("커스텀 훅에서 받은 svg가 렌더링된다.", () => {
    render(<TodoTimeline todos={[]} />);

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();
  });
});
