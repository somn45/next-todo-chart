import { getTodoStats } from "@/apis/getTodoStats";
import { connectDB } from "@/libs/database";
import { Stat } from "@/types/schema";
import { redirect } from "next/navigation";

const ONE_DAY = 1000 * 60 * 60 * 24;

const mockTodoStats: Stat[] = [
  {
    _id: new Date(2025, 6, 1),
    totalCount: 8,
    todoStateCount: 3,
    doingStateCount: 3,
    doneStateCount: 2,
  },
  {
    _id: new Date(2025, 6, 2),
    totalCount: 10,
    todoStateCount: 4,
    doingStateCount: 3,
    doneStateCount: 3,
  },
  {
    _id: new Date(2025, 6, 3),
    totalCount: 10,
    todoStateCount: 4,
    doingStateCount: 3,
    doneStateCount: 3,
  },
  {
    _id: new Date(2025, 6, 4),
    totalCount: 10,
    todoStateCount: 4,
    doingStateCount: 3,
    doneStateCount: 3,
  },
  {
    _id: new Date(2025, 6, 5),
    totalCount: 10,
    todoStateCount: 4,
    doingStateCount: 3,
    doneStateCount: 3,
  },
  {
    _id: new Date(2025, 6, 6),
    totalCount: 10,
    todoStateCount: 4,
    doingStateCount: 3,
    doneStateCount: 3,
  },
  {
    _id: new Date(2025, 6, 7),
    totalCount: 10,
    todoStateCount: 4,
    doingStateCount: 3,
    doneStateCount: 3,
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

    const todoStats = await getTodoStats("mockuser");

    expect(statCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(statCollection.aggregate).toHaveBeenCalledWith([
      {
        $match: { date: { $in: mockTodoStats.map(stat => stat._id) } },
      },
      {
        $group: {
          _id: "$date",
          totalCount: {
            $sum: 1,
          },
          todoStateCount: {
            $sum: {
              $cond: [{ $eq: ["$todo.state", "할 일"] }, 1, 0],
            },
          },
          doingStateCount: {
            $sum: {
              $cond: [{ $eq: ["$todo.state", "진행 중"] }, 1, 0],
            },
          },
          doneStateCount: {
            $sum: {
              $cond: [{ $eq: ["$todo.state", "완료"] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    expect(todoStats).toEqual(
      mockTodoStats.map(stat => ({ ...stat, _id: stat._id.toISOString() })),
    );
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
