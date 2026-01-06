/**
 * @jest-environment node
 */

import { editTodo } from "@/actions/editTodo";
import { connectDB } from "@/libs/database";
import { revalidateTag } from "next/cache";
import { mockTodo } from "../../__mocks__/todos";
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

describe("editTodo 서버 액션", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("editTodo 서버 액션이 실행되면 DB 수정 쿼리, todo 캐시 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("todo", "수정된 투두");

    jest.useFakeTimers();
    const MOCK_DATE = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_DATE);
    const updatedAt = MOCK_DATE;

    await editTodo(
      { todoid: "123456789012345678901234", userid: "mockuser" },
      { message: "" },
      formData,
    );

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todo").findOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todo").findOne).toHaveBeenCalledWith({
      _id: new ObjectId(mockTodo._id),
    });

    expect(db.collection("todo").updateOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todo").updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          textField: "수정된 투두",
          updatedAt,
        },
      },
    );

    expect(revalidateTag).toHaveBeenCalledTimes(3);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
    expect(revalidateTag).toHaveBeenCalledWith("dashboard");
  });

  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();
    formData.set("todo", "mock text");
    const editTodoActionState = await editTodo(
      { todoid: "123456789012345678901234", userid: null },
      { message: "" },
      formData,
    );

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(editTodoActionState.message).toEqual(
      "할 일을 수정하는 작업은 로그인이 필요합니다.",
    );
    expect(db.collection("todo").findOne).not.toHaveBeenCalled();
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("formData로부터 받은 newTodo가 없거나 길이가 0일 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();
    const editTodoActionState = await editTodo(
      { todoid: "123456789012345678901234", userid: "mockuser" },
      { message: "" },
      formData,
    );

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(editTodoActionState.message).toEqual(
      "할 일에 내용이 작성되어 있지 않습니다.",
    );
    expect(db.collection("todo").findOne).not.toHaveBeenCalled();
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("인수로 받은 todoid가 없거나 ObjectId 할당에 적절한 타입이 아닐 경우 에러를 던진다.", async () => {
    const formData = new FormData();
    formData.set("todo", "mock text");

    const db = (await connectDB).db("next-todo-chart-cluster");

    const editTodoActionState = await editTodo(
      { todoid: "22", userid: "mocksuser" },
      { message: "" },
      formData,
    );

    expect(editTodoActionState.message).toEqual(
      "투두 수정 과정 중 에러가 발생했습니다. Invalid ObjectId Type 22",
    );
    expect(db.collection("todo").findOne).not.toHaveBeenCalled();
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 조회 결과가 null이나 undefined일 때 Todo not found 에러를 던진다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").findOne as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.set("todo", "mock text");

    const editTodoActionState = await editTodo(
      { todoid: "123456789012345678901234", userid: "mockuser" },
      { message: "" },
      formData,
    );

    expect(editTodoActionState.message).toEqual(
      "투두 수정 과정 중 에러가 발생했습니다. Todo not found",
    );
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("formData로부터 받은 수정된 투두가 기존 투두의 내용과 같다면 이전 내용과 동일하다는 메세지를 반환한다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").findOne as jest.Mock).mockResolvedValue({
      userid: "mockuser",
      textField: "mock text",
    });

    const formData = new FormData();
    formData.set("todo", "mock text");

    const editTodoActionState = await editTodo(
      { todoid: "123456789012345678901234", userid: "mockuser" },
      { message: "" },
      formData,
    );

    expect(editTodoActionState.message).toEqual(
      "이전에 작성한 내용과 동일합니다.",
    );
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
