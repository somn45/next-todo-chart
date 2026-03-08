jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));
jest.mock("@/libs/database.ts");

import { addTodo } from "@/actions/addTodo";
import { revalidateTag } from "next/cache";
import * as database from "@/libs/database";
// @ts-ignore
const { mockCollection } = database;

const mockTodo = {
  insertedId: "123456789012345678901234",
  userid: "mockuser",
  textField: "hello world!",
};

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

    (mockCollection.insertOne as jest.Mock).mockResolvedValue(mockTodo);
    (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTodo);

    await addTodo("mockuser", { message: "" }, formData);

    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      userid: "mockuser",
      textField: "새 투두",
      state: "할 일",
      createdAt,
      updatedAt,
      completedAt,
    });
    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
      { author: "mockuser" },
      { $push: { content: mockTodo.insertedId } },
      { upsert: true },
    );
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
    expect(revalidateTag).toHaveBeenCalledWith("dashboard");
  });

  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();
    formData.set("newTodo", "mock text");

    (mockCollection.insertOne as jest.Mock).mockResolvedValue(mockTodo);
    (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTodo);

    const addTodoActionState = await addTodo(null, { message: "" }, formData);

    expect(addTodoActionState.message).toEqual(
      "할 일을 추가하는 작업은 로그인이 필요합니다.",
    );
    expect(mockCollection.insertOne).not.toHaveBeenCalled();
    expect(mockCollection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("formData로부터 받은 newTodo가 없거나 길이가 0일 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();

    (mockCollection.insertOne as jest.Mock).mockResolvedValue(mockTodo);
    (mockCollection.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTodo);

    const addTodoActionState = await addTodo(
      "mockuser",
      { message: "" },
      formData,
    );

    expect(addTodoActionState.message).toEqual(
      "할 일에 내용이 작성되어 있지 않습니다.",
    );
    expect(mockCollection.insertOne).not.toHaveBeenCalled();
    expect(mockCollection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 삽입 결과가 undefined나 null일 때 Todo not found 에러를 던진다", async () => {
    const formData = new FormData();
    formData.set("newTodo", "mock text");

    (mockCollection.insertOne as jest.Mock).mockResolvedValue(null);

    const addTodoActionState = await addTodo(
      "mockuser",
      { message: "" },
      formData,
    );

    expect(addTodoActionState.message).toEqual(
      `투두 추가 과정 중 에러가 발생했습니다. Todo not found`,
    );
    expect(mockCollection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
