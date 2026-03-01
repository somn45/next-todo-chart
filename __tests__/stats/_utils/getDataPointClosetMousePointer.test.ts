import * as d3 from "d3";
import { createLinearScale, createTimeScale } from "@/utils/graph";
import { getDataPointClosetMousePointer } from "@/app/(private)/stats/_utils/getDataPointClosetMousePointer";
import { mockTodoStats } from "../../../__mocks__/stats";

describe("getDataPointClosetMousePointer", () => {
  const margin = { top: 20, left: 40, bottom: 20, right: 80 };
  const width = 600 - margin.left - margin.right;
  const height = 450 - margin.top - margin.bottom;

  it("getDataPointClosetMousePointer 유틸 함수 실행 시 mousemove 이벤트가 실행되었을 때의 마우스 포인터의 Y 좌표와 가장 가까운 데이터 포인트를 반환한다.", () => {
    const timeScale = createTimeScale({ rangeMax: width, data: mockTodoStats });
    const linearScale = createLinearScale(mockTodoStats, height);

    const event = new MouseEvent("mousemove", {
      clientX: 150,
      clientY: 150,
    });

    const target = getDataPointClosetMousePointer(
      d3.group(mockTodoStats, d => d.state),
      { x_scale: timeScale, y_scale: linearScale },
      event,
    );

    expect(target).not.toBeNull();
    expect(target).toHaveProperty("date");
    expect(target).toHaveProperty("count");
    expect(target).toHaveProperty("state");
    expect(target).toHaveProperty("y_pixel");
  });
});
