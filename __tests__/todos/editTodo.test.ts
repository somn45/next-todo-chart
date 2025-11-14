/**
 * @jest-environment node
 */

import { editTodo } from "@/actions/editTodo";
import { connectDB } from "@/libs/database";
import { revalidateTag } from "next/cache";
import { mockTodo } from "../../__mocks__/todos";
import { ObjectId } from "mongodb";

const AFTER_NINE_HOUR = 1000 * 60 * 60 * 9;

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
  it("editTodo 서버 액션이 실행되면 DB 수정 쿼리, todo 캐시 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("todo", "수정된 투두");

    jest.useFakeTimers();
    const MOCK_DATE = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_DATE);
    const updatedAt = new Date(MOCK_DATE.getTime() + AFTER_NINE_HOUR);

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

    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
  });
});
