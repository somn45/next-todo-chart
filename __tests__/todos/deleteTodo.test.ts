/**
 * @jest-environment node
 */

import { deleteTodo } from "@/actions/deleteTodo";
import { mockTodo } from "../../__mocks__/todos";
import { connectDB } from "@/libs/database";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));
jest.mock("@/libs/database", () => {
  const mockCollection = {
    findOne: jest.fn().mockResolvedValue({
      _id: "123456789012345678901234",
      userid: "mockuser",
      textField: "hello world!",
    }),
    deleteOne: jest.fn(),
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

describe("deleteTodo 서버 액션", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("deleteTodo 서버 액션이 실행되면 DB 삭제 쿼리, todo 캐시 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("todo-id", mockTodo._id);
    await deleteTodo("mockuser", { message: "" }, formData);

    const db = (await connectDB).db("next-todo-chart-cluster");
    expect(db.collection("todo").deleteOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todo").deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(mockTodo._id),
    });
    expect(db.collection("todos").updateOne).toHaveBeenCalledTimes(1);
    expect(db.collection("todos").updateOne).toHaveBeenCalledWith(
      { author: "mockuser" },
      { $pull: { content: new ObjectId(mockTodo._id) } },
    );
    expect(revalidateTag).toHaveBeenCalledTimes(3);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
    expect(revalidateTag).toHaveBeenCalledWith("dashboard");
  });

  it("인수로 받은 userid가 없을 경우 에러 메세지를 반환한다.", async () => {
    const formData = new FormData();
    formData.set("todo-id", mockTodo._id);
    const deleteTodoActionState = await deleteTodo(
      null,
      { message: "" },
      formData,
    );

    const db = (await connectDB).db("next-todo-chart-cluster");

    expect(deleteTodoActionState.message).toEqual(
      "할 일을 삭제하는 작업은 로그인이 필요합니다.",
    );
    expect(db.collection("todo").findOne).not.toHaveBeenCalled();
    expect(db.collection("todo").deleteOne).not.toHaveBeenCalled();
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("formData로부터 받은 todo-id가 없거나 ObjectId 할당에 적절한 타입이 아닐 경우 에러를 던진다.", async () => {
    const formData = new FormData();
    formData.set("todo-id", "22");

    const db = (await connectDB).db("next-todo-chart-cluster");

    const deleteTodoActionState = await deleteTodo(
      "mockuser",
      { message: "" },
      formData,
    );

    expect(deleteTodoActionState.message).toEqual(
      "투두 삭제 과정 중 에러가 발생했습니다. Invalid ObjectId Type 22",
    );
    expect(db.collection("todo").findOne).not.toHaveBeenCalled();
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 조회 결과가 null이나 undefined일 때 Todo not found 에러를 던진다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").findOne as jest.Mock).mockResolvedValue(null);

    const formData = new FormData();
    formData.set("todo-id", mockTodo._id);

    const deleteTodoActionState = await deleteTodo(
      "mockuser",
      { message: "" },
      formData,
    );

    expect(deleteTodoActionState.message).toEqual(
      "투두 삭제 과정 중 에러가 발생했습니다. Todo not found",
    );
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 삭제 시 조회된 투두 작성자와 로그인 중인 userid가 다를 경우 에러 메세지를 반환한다.", async () => {
    const db = (await connectDB).db("next-todo-chart-cluster");
    (db.collection("todo").findOne as jest.Mock).mockResolvedValue({
      _id: "123456789012345678901234",
      userid: "mockuser",
      textField: "hello world!",
    });

    const formData = new FormData();
    formData.set("todo-id", mockTodo._id);

    const deleteTodoActionState = await deleteTodo(
      "noAuthorityUser",
      { message: "" },
      formData,
    );

    expect(deleteTodoActionState.message).toEqual(
      "투두를 작성한 사용자만 투두를 삭제할 수 있습니다.",
    );
    expect(db.collection("todo").updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
