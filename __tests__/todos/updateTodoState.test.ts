/**
 * @jest-environment node
 */

jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));
jest.mock("@/libs/database");

import { updateTodoState } from "@/actions/updateTodoState";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

const mockTodo = {
  _id: "123456789012345678901234",
  userid: "mockuser",
  textField: "기존 투두",
};

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

    (mockCollection.findOne as jest.Mock).mockResolvedValue(mockTodo);

    await updateTodoState(mockTodo._id, { message: "" }, formData);

    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOne).toHaveBeenCalledWith({
      _id: new ObjectId(mockTodo._id),
    });

    expect(mockCollection.updateOne).toHaveBeenCalledTimes(2);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          state: "진행 중",
          updatedAt,
        },
      },
    );
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          completedAt: null,
        },
      },
    );

    expect(revalidateTag).toHaveBeenCalledTimes(3);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
    expect(revalidateTag).toHaveBeenCalledWith("dashboard");
  });

  it("만약 FormData에 완료 상태가 담겨있다면 completedAt 속성을 변경하는 쓰기 함수가 호출된다.", async () => {
    const formData = new FormData();
    formData.set("state", "완료");

    const AFTER_TEN_MINUTES = 1000 * 60 * 10;

    jest.useFakeTimers();
    const MOCK_DATE = new Date("2025-11-14T00:00:00.000Z");
    jest.setSystemTime(MOCK_DATE);
    const updatedAt = MOCK_DATE;

    (mockCollection.findOne as jest.Mock).mockResolvedValue(mockTodo);

    await updateTodoState(mockTodo._id, { message: "" }, formData);

    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOne).toHaveBeenCalledWith({
      _id: new ObjectId(mockTodo._id),
    });

    expect(mockCollection.updateOne).toHaveBeenCalledTimes(2);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          state: "완료",
          updatedAt,
        },
      },
    );
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { _id: new ObjectId(mockTodo._id) },
      {
        $set: {
          completedAt: new Date(Date.now() + AFTER_TEN_MINUTES),
        },
      },
    );

    expect(revalidateTag).toHaveBeenCalledTimes(3);
    expect(revalidateTag).toHaveBeenCalledWith(`todo-${mockTodo._id}`);
    expect(revalidateTag).toHaveBeenCalledWith("todos");
    expect(revalidateTag).toHaveBeenCalledWith("dashboard");
  });

  it("인수로 받는 todoid가 없거나 ObjectId 타입 할당에 적절하지 않은 경우 에러를 던진다.", async () => {
    const formData = new FormData();
    formData.set("state", "진행 중");

    const updateTodoStateActionState = await updateTodoState(
      "22",
      { message: "" },
      formData,
    );

    expect(updateTodoStateActionState.message).toEqual(
      "투두 상태 수정 과정 중 에러가 발생했습니다. Invalid ObjectId Type 22",
    );
    expect(mockCollection.findOne).not.toHaveBeenCalled();
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("투두 문서 조회 결과가 null이나 undefined일 경우 Todo not found 에러를 던진다.", async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue(null);

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
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("변경된 투두의 상태와 이전 투두의 상태가 같은 경우 사용자에게 메세지를 반환한다.", async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue({
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
    expect(mockCollection.updateOne).not.toHaveBeenCalled();
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
