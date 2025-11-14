import { addTodo } from "@/actions/addTodo";
import { connectDB } from "@/libs/database";
import { revalidateTag } from "next/cache";
import { mockTodo } from "../../__mocks__/todos";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));
jest.mock("@/libs/database", () => {
  const mockTodo = {
    insertedId: "123456789012345678901234",
    userid: "mockuser",
    textField: "hello world!",
  };

  const mockCollection = {
    insertOne: jest.fn().mockResolvedValue(mockTodo),
    findOneAndUpdate: jest.fn().mockResolvedValue(mockTodo),
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

describe("addTodo 서버 액션", () => {
  it("addTodo 서버 액션이 실행되면 todo 추가 쿼리, 캐시 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("newTodo", "새 투두");

    jest.useFakeTimers();
    const MOCK_TIME = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_TIME);
    const createdAt = new Date(MOCK_TIME.getTime() + AFTER_NINE_HOUR);
    const updatedAt = new Date(MOCK_TIME.getTime() + AFTER_NINE_HOUR);

    await addTodo("mockuser", { message: "" }, formData);

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todos").insertOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todos").insertOne).toHaveBeenCalledWith({
      userid: "mockuser",
      textField: "새 투두",
      state: "할 일",
      createdAt,
      updatedAt,
    });
    expect(db.collection("todos").findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(db.collection("todos").findOneAndUpdate).toHaveBeenCalledWith(
      { author: "mockuser" },
      { $push: { content: mockTodo._id } },
      { upsert: true },
    );
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
  });
});
