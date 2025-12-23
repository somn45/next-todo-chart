import TimeLine from "@/app/(private)/stats/TimeLine";
import { render, screen } from "@testing-library/react";

describe("TimeLine 컴포넌트", () => {
  it("TimeLine 컴포넌트에서 커스텀 훅에서 받은 svg가 렌더링된다.", () => {
    render(<TimeLine todos={[]} />);
    screen.debug();

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();
  });
});
