import {
  createBandScale,
  createLinearScale,
  createSVGContainer,
  createTimeScale,
  setXAxis,
  setYAxis,
} from "@/utils/graph";
import { screen } from "@testing-library/react";

describe("D3 axis function", () => {
  const margin = { top: 20, left: 40, bottom: 20, right: 80 };
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;
  const layout = { width, height, margin };

  it("", () => {
    const graphWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const timeScale = createTimeScale({
      timeScaleDomain: [new Date(2025, 6, 1), new Date(2025, 6, 7)],
      rangeMax: width,
    });

    setXAxis(svg, timeScale, 7, height);

    const xAxis: HTMLElement | null = graphWrapper.querySelector(".xAxis");
    const ticks = graphWrapper.querySelectorAll(".tick");

    expect(xAxis).not.toBeNull();
    if (xAxis) {
      expect(graphWrapper).toContainElement(xAxis);
      expect(xAxis).toHaveAttribute("transform", `translate(0, ${height})`);
      expect(ticks).toHaveLength(7);
    }
  });
  it("setYAxis", () => {
    const graphWrapper = document.createElement("div");
    const svg = createSVGContainer(layout, graphWrapper);

    const linearScale = createLinearScale([], height);

    setYAxis(svg, linearScale);

    const yAxis: HTMLElement | null = graphWrapper.querySelector(".yAxis");

    expect(yAxis).not.toBeNull();
    if (yAxis) {
      expect(graphWrapper).toContainElement(yAxis);
    }
  });
});
