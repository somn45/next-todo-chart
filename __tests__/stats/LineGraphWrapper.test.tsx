import { getTodoStats } from "@/apis/getTodoStats";
import { setTodoStats } from "@/apis/setTodoStats";
import LineGraph from "@/app/(private)/stats/LineGraph";
import LineGraphWrapper from "@/app/(private)/stats/LineGraphWrapper";
import { render, screen, waitFor } from "@testing-library/react";

const lineGraphDatas: { date: Date; state: string; count: number }[] = [
  {
    date: new Date(2025, 6, 1),
    state: "총합",
    count: 8,
  },
  {
    date: new Date(2025, 6, 1),
    state: "할 일",
    count: 2,
  },
  {
    date: new Date(2025, 6, 1),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2025, 6, 1),
    state: "완료",
    count: 3,
  },
];
jest.mock("@/libs/database", () => ({
  connectDB: Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertMany: jest.fn(),
        findOne: jest.fn(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
          next: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
  }),
}));
jest.mock("@/apis/setTodoStats");
jest.mock("@/apis/getTodoStats", () => {
  const mockStats = [
    {
      _id: new Date(2025, 6, 1),
      doingStateCount: 3,
      doneStateCount: 3,
      todoStateCount: 2,
      totalCount: 8,
    },
  ];

  return {
    getTodoStats: jest.fn().mockResolvedValue(mockStats),
  };
});

describe("LineGraphWrapper 서버 컴포넌트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("LineGraphWrapper 서버 컴포넌트가 렌더링 중 setTodoStats, getTodoStats API 함수를 호출한다", async () => {
    const LineGraphWrapperCompoennt = await LineGraphWrapper({
      userid: "mockuser",
    });
    render(LineGraphWrapperCompoennt);

    await waitFor(() => {
      expect(setTodoStats).toHaveBeenCalledTimes(1);
      expect(setTodoStats).toHaveBeenCalledWith("mockuser");
      expect(getTodoStats).toHaveBeenCalledTimes(1);
      expect(getTodoStats).toHaveBeenCalledWith("mockuser");
    });
  });
});
