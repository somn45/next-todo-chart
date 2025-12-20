import caculateBandLength from "@/app/(private)/stats/_utils/caculateBandLength";
import { ITodo } from "@/types/schema";
import { createTimeScale } from "@/utils/graph";

const mockTodo: ITodo = {
  userid: "mockuser",
  textField: "임의의 할 일",
  state: "진행 중",
  createdAt: new Date(2025, 6, 2).toString(),
  updatedAt: new Date(2025, 6, 4),
  completedAt: new Date(2025, 6, 4),
};

const mockTodoWithoutCompletedAt: ITodo = {
  userid: "mockuser",
  textField: "임의의 할 일",
  state: "진행 중",
  createdAt: new Date(2025, 6, 2).toString(),
  updatedAt: new Date(2025, 6, 4),
  completedAt: null,
};

const mockTodoIfCreatedAtLessthanDomainStart: ITodo = {
  userid: "mockuser",
  textField: "임의의 할 일",
  state: "진행 중",
  createdAt: new Date(2025, 5, 27).toString(),
  updatedAt: new Date(2025, 6, 4),
  completedAt: new Date(2025, 6, 4),
};

describe("caculateBandLength", () => {
  it("caculateBandLength 유틸 함수는 데이터와 밴드 스케일, 그리고 도메인을 받아 밴드의 길이를 반환한다", () => {
    const rangeMax = 600;

    const timeScaleDomain: [Date, Date] = [
      new Date(2025, 6, 1),
      new Date(2025, 6, 7),
    ];
    const timeScale = createTimeScale({
      rangeMax,
      timeScaleDomain,
    });

    const bandLength = caculateBandLength(
      mockTodo,
      { x_scale: timeScale },
      { domainStart: timeScaleDomain[0], domainEnd: timeScaleDomain[1] },
    );
    expect(bandLength).toEqual((rangeMax / 6) * (4 - 2));
  });
  it("completedAt이 null이라면 도메인 종단값으로 대체되어 밴드의 길이를 계산한다.", () => {
    const rangeMax = 600;

    const timeScaleDomain: [Date, Date] = [
      new Date(2025, 6, 1),
      new Date(2025, 6, 7),
    ];
    const timeScale = createTimeScale({
      rangeMax,
      timeScaleDomain,
    });

    const bandLength = caculateBandLength(
      mockTodoWithoutCompletedAt,
      { x_scale: timeScale },
      { domainStart: timeScaleDomain[0], domainEnd: timeScaleDomain[1] },
    );
    expect(bandLength).toEqual((rangeMax / 6) * (7 - 2));
  });
  it("todo의 createdAt 속성이 도메인의 시작값보다 더 작다면 해당 속성은 도메인 시작값으로 대체되어 밴드의 길이를 계산한다.", () => {
    const rangeMax = 600;

    const timeScaleDomain: [Date, Date] = [
      new Date(2025, 6, 1),
      new Date(2025, 6, 7),
    ];
    const timeScale = createTimeScale({
      rangeMax,
      timeScaleDomain,
    });

    const bandLength = caculateBandLength(
      mockTodoIfCreatedAtLessthanDomainStart,
      { x_scale: timeScale },
      { domainStart: timeScaleDomain[0], domainEnd: timeScaleDomain[1] },
    );
    expect(bandLength).toEqual((rangeMax / 6) * (4 - 1));
  });
});

// 11/1 ~ 11/7 domain
// 11/3 ~ null
