import LineGraph from "@/app/(private)/stats/LineGraph";
import { render, screen } from "@testing-library/react";

describe("LineGraph", () => {
  it("LineGraph 컴포넌트에서 커스텀 훅에서 받은 svg가 렌더링된다.", () => {
    render(<LineGraph stats={[]} />);
    screen.debug();

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();
  });
});
