/**
 * @jest-environment node
 */

import { updateTodoState } from "@/actions/updateTodoState";
import { mockTodo } from "../../__mocks__/todos";
import { connectDB } from "@/libs/database";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));
jest.mock("@/libs/database", () => {
  const mockTodo = {
    _id: "123456789012345678901234",
    userid: "mockuser",
    textField: "기존 투두",
  };

  const mockCollection = {
    findOne: jest.fn().mockResolvedValue(mockTodo),
    updateOne: jest.fn(),
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

describe("투두의 상태 수정을 담당하는 서버 액션", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("updateTodoState 서버 액션이 실행되면 formData로부터 받은 state를 투두 상태로 갱신된다.", async () => {
    const formData = new FormData();
    formData.set("state", "진행 중");

    jest.useFakeTimers();
    const MOCK_DATE = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_DATE);
    const updatedAt = MOCK_DATE;

    await updateTodoState(mockTodo._id, { message: "" }, formData);

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(db.collection("todo").findOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todo").findOne).toHaveBeenCalledWith({
      _id: new ObjectId(mockTodo._id),
    });

    expect(db.collection("todos").updateOne).toHaveBeenCalledTimes(2);
    expect(db.collection("todos").updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          state: "진행 중",
          updatedAt,
        },
      },
    );
    expect(db.collection("todos").updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          completedAt: null,
        },
      },
    );

    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
  });

  it("만약 FormData에 완료 상태가 담겨있다면 completedAt 속성을 변경하는 쓰기 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("state", "완료");

    const AFTER_TEN_MINUTES = 1000 * 60 * 10;

    jest.useFakeTimers();
    const MOCK_DATE = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_DATE);
    const updatedAt = MOCK_DATE;

    await updateTodoState(mockTodo._id, { message: "" }, formData);

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(db.collection("todo").findOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todo").findOne).toHaveBeenCalledWith({
      _id: new ObjectId(mockTodo._id),
    });

    expect(db.collection("todos").updateOne).toHaveBeenCalledTimes(2);
    expect(db.collection("todos").updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          state: "완료",
          updatedAt,
        },
      },
    );
    expect(db.collection("todos").updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          completedAt: new Date(Date.now() + AFTER_TEN_MINUTES),
        },
      },
    );

    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
  });

  it("인수로 받는 todoid가 없거나 ObjectId 타입 할당에 적절하지 않은 경우 에러를 던진다.", async () => {
    const formData = new FormData();
    formData.set("state", "진행 중");

    const updateTodoStateActionState = await updateTodoState(
      "22",
      { message: "" },
      formData,
    );

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(updateTodoStateActionState.message).toEqual(
      "투두 상태 수정 과정 중 에러가 발생했습니다. Invalid ObjectId Type 22",
    );
    expect(db.collection("todo").findOne).not.toHaveBeenCalled();
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 조회 결과가 null이나 undefined일 경우 Todo not found 에러를 던진다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").findOne as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.set("state", "진행 중");

    const updateTodoStateActionState = await updateTodoState(
      mockTodo._id,
      { message: "" },
      formData,
    );

    expect(updateTodoStateActionState.message).toEqual(
      "투두 상태 수정 과정 중 에러가 발생했습니다. Todo not found",
    );
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("변경된 투두의 상태와 이전 투두의 상태가 같은 경우 사용자에게 메세지를 반환한다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").findOne as jest.Mock).mockResolvedValue({
      _id: mockTodo._id,
      state: "진행 중",
    });

    const formData = new FormData();
    formData.set("state", "진행 중");

    const updateTodoStateActionState = await updateTodoState(
      mockTodo._id,
      { message: "" },
      formData,
    );

    expect(updateTodoStateActionState.message).toEqual(
      "할 일의 상태가 이전과 다르지 않습니다.",
    );
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
