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
  it("deleteTodo 서버 액션이 실행되면 DB 삭제 쿼리, todo 캐시 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("todoid", mockTodo._id);
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
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
  });
});
