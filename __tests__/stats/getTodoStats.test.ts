import { getTodoStats } from "@/apis/getTodoStats";
import { connectDB } from "@/libs/database";
import { ILineGraphData } from "@/types/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import { redirect } from "next/navigation";

const mockTodoStats: ILineGraphData[] = [
  {
    date: new Date(2026, 1, 17),
    state: "할 일",
    count: 5,
  },
];

jest.useFakeTimers();
jest.setSystemTime(new Date(2025, 6, 8));
jest.mock("@/libs/database", () => {
  return {
    connectDB: Promise.resolve({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn(),
          }),
        }),
      }),
    }),
  };
});
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("getTodoStats API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("getTodoStats 함수가 실행될 경우 최근 7일에 해당하는 Todo Stat 목록을 반환한다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    const statCollection = db.collection("stat");
    (statCollection.aggregate as jest.Mock).mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockTodoStats),
    });

    const todoStats = await getTodoStats("mockuser", "month");
    const searchRange = "month";

    expect(statCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(statCollection.aggregate).toHaveBeenCalledWith([
      {
        $match: { date: { $in: getDatesLastlyPeriod(searchRange) } },
      },
      { $project: { _id: 0 } },
    ]);

    expect(todoStats).toEqual(mockTodoStats);
  });
});

describe("getTodoStats 에러 핸들링 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    await getTodoStats(null);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("stat").aggregate).not.toHaveBeenCalled();
  });
});
