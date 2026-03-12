import { render, screen } from "@testing-library/react";
import TimeLineSparkline from "@/app/(private)/dashboard/@graph/timeline/Sparkline";
import { BandSparkline } from "@/utils/graph/band/sparkline";

describe("Timeline Sparkline", () => {
  it("마운트 시 그래프 컨테이너 svg가 렌더링되고, 언마운트 시 소멸된다.", () => {
    const { unmount, container } = render(
      <TimeLineSparkline todos={[]} dateDomainBase="month" />,
    );

    const svgContainer = screen.getByTestId("svg container");
    expect(svgContainer).toBeInTheDocument();

    unmount();

    expect(container.innerHTML).toBe("");
  });
});
