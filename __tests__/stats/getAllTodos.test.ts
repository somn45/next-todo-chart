import { getAllTodos } from "@/apis/getAllTodos";
import { connectDB } from "@/libs/database";
import { WithStringifyId } from "@/types/schema";
import { redirect } from "next/navigation";

export interface LookupedTodo {
  author: string;
  content: WithStringifyId & ITodo;
}

export interface ITodo {
  userid: string;
  textField: string;
  state: "할 일" | "진행 중" | "완료";
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

const mockTodos: (LookupedTodo & WithStringifyId)[] = [
  {
    _id: "1",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "테스트 코드 작성",
      state: "진행 중",
      createdAt: new Date(2025, 6, 1).toString(),
      updatedAt: new Date(2025, 6, 5).toUTCString(),
      completedAt: new Date(2025, 6, 5).toUTCString(),
    },
  },
  {
    _id: "2",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "testing",
      textField: "디자인 추가",
      state: "할 일",
      createdAt: new Date(2025, 6, 3).toString(),
      updatedAt: new Date(2025, 6, 7).toUTCString(),
      completedAt: null,
    },
  },
  {
    _id: "3",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "주간 회의 일지 작성",
      state: "완료",
      createdAt: new Date(2025, 5, 30).toString(),
      updatedAt: new Date(2025, 6, 3).toUTCString(),
      completedAt: new Date(2025, 6, 3).toUTCString(),
    },
  },
];

jest.mock("@/libs/database", () => {
  const mockCollection = {
    aggregate: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    }),
  };
  const mockDb = {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
    }),
  };
  return {
    connectDB: Promise.resolve(mockDb),
  };
});
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("getAllTodos API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("getAllTodos 함수가 실행될 경우 오늘 날짜에 해당되는 금주에 활성화된 투두 목록을 반환한다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todos").aggregate as jest.Mock).mockReturnValue({
      toArray: jest.fn().mockResolvedValue(mockTodos),
    });

    const currentDay = new Date().getDay();
    const currentWeekArray = Array.from(
      { length: 7 },
      (_, i) => i - currentDay,
    );
    const currentWeek = currentWeekArray.map(ele => {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      return new Date(Date.now() + ONE_DAY * ele);
    });

    const currentWeekStartDate = new Date(
      currentWeek[0].getFullYear(),
      currentWeek[0].getMonth(),
      currentWeek[0].getDate(),
      0,
      0,
    );

    const currentWeekEndDate = new Date(
      currentWeek[currentWeek.length - 1].getFullYear(),
      currentWeek[currentWeek.length - 1].getMonth(),
      currentWeek[currentWeek.length - 1].getDate(),
      23,
      59,
    );

    const todos = await getAllTodos("mockuser");

    const todosCollection = db.collection("todos");
    expect(todosCollection.aggregate).toHaveBeenCalledTimes(1);
    expect(todosCollection.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          author: "mockuser",
        },
      },
      {
        $lookup: {
          from: "todo",
          localField: "content",
          foreignField: "_id",
          as: "content",
        },
      },
      {
        $unwind: {
          path: "$content",
        },
      },
      {
        $match: {
          $and: [
            { "content.createdAt": { $lte: currentWeekEndDate } },
            {
              $or: [
                { "content.completedAt": { $gte: currentWeekStartDate } },
                { "content.completedAt": null },
              ],
            },
          ],
        },
      },
      {
        $set: {
          _id: { $toString: "$_id" },
        },
      },
    ]);

    expect(todos).toEqual(mockTodos);
  });
});

describe("getAllTodos 에러 핸들링 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    await getAllTodos(null);

    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todos").aggregate).not.toHaveBeenCalled();
  });
});
