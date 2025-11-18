import { addTodo } from "@/actions/addTodo";
import { connectDB } from "@/libs/database";
import { revalidateTag } from "next/cache";
import { mockTodo } from "../../__mocks__/todos";

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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("addTodo 서버 액션이 실행되면 todo 추가 쿼리, 캐시 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("newTodo", "새 투두");

    jest.useFakeTimers();
    const MOCK_DATE = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_DATE);
    const createdAt = MOCK_DATE;
    const updatedAt = MOCK_DATE;
    const completedAt = null;

    await addTodo("mockuser", { message: "" }, formData);

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todos").insertOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todos").insertOne).toHaveBeenCalledWith({
      userid: "mockuser",
      textField: "새 투두",
      state: "할 일",
      createdAt,
      updatedAt,
      completedAt,
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

  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();
    formData.set("newTodo", "mock text");
    const addTodoActionState = await addTodo(null, { message: "" }, formData);

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(addTodoActionState.message).toEqual(
      "할 일을 추가하는 작업은 로그인이 필요합니다.",
    );
    expect(db.collection("todo").insertOne).not.toHaveBeenCalled();
    expect(db.collection("todo").findOneAndUpdate).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("formData로부터 받은 newTodo가 없거나 길이가 0일 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();
    const addTodoActionState = await addTodo(
      "mockuser",
      { message: "" },
      formData,
    );

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(addTodoActionState.message).toEqual(
      "할 일에 내용이 작성되어 있지 않습니다.",
    );
    expect(db.collection("todo").insertOne).not.toHaveBeenCalled();
    expect(db.collection("todo").findOneAndUpdate).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 삽입 결과가 undefined나 null일 때 Todo not found 에러를 던진다", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").insertOne as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.set("newTodo", "mock text");
    const addTodoActionState = await addTodo(
      "mockuser",
      { message: "" },
      formData,
    );

    expect(addTodoActionState.message).toEqual(
      `투두 추가 과정 중 에러가 발생했습니다. Todo not found`,
    );
    expect(db.collection("todo").findOneAndUpdate).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
