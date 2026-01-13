import { render, screen } from "@testing-library/react";
import TimeLineSparkline from "@/app/(private)/dashboard/@graph/timeline/Sparkline";

describe("Timeline Sparkline", () => {
  it("Timeline 컴포넌트에서 커스텀 훅에서 받은 svg가 렌더링된다.", () => {
    render(<TimeLineSparkline todos={[]} dateDomainBase="month" />);

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();
  });
});
