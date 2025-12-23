import { getAllTodos } from "@/apis/getAllTodos";
import TimeLineWrapper from "@/app/(private)/stats/TimeLineWrapper";
import { render, waitFor } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: Promise.resolve({
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertMany: jest.fn(),
        findOne: jest.fn(),
        aggregate: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([]),
          next: jest.fn().mockResolvedValue([]),
        }),
      }),
    }),
  }),
}));
jest.mock("@/apis/getAllTodos", () => {
  return {
    getAllTodos: jest.fn().mockResolvedValue([]),
  };
});

describe("TimeLineWrapper 서버 컴포넌트", () => {
  it("TimeLineWrapper 서버 컴포넌트 렌더링 중 getAllTodos API 함수가 호출된다.", async () => {
    const timeLineWrapperComponent = await TimeLineWrapper({
      userid: "mockuser",
    });
    render(timeLineWrapperComponent);

    await waitFor(() => {
      expect(getAllTodos).toHaveBeenCalledTimes(1);
      expect(getAllTodos).toHaveBeenCalledWith("mockuser");
    });
  });
});
