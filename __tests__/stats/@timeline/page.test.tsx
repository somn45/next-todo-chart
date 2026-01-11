import { getAllTodos } from "@/apis/getAllTodos";
import Timeline from "@/app/(private)/stats/@timeline/page";
import { render } from "@testing-library/react";
import { mockTodos } from "../../../__mocks__/todos";

jest.mock("@/apis/getAllTodos", () => {
  return {
    getAllTodos: jest.fn().mockResolvedValue([]),
  };
});
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("accessToken"),
  }),
}));
jest.mock("@/utils/decodeJwtTokenPayload", () => ({
  decodeJwtTokenPayload: jest.fn().mockReturnValue("mockuser"),
}));
jest.mock("@/components/domain/Stat/TodoTimeline", () =>
  jest.fn(props => <div data-testid="timeline"></div>),
);

import TodoTimeline from "@/components/domain/Stat/TodoTimeline";

describe("<Timeline />", () => {
  it("getAllTodos API에서 가져온 투두리스트 데이터와 함께 Timeline 컴포넌트를 렌더링한다.", async () => {
    (getAllTodos as jest.Mock).mockResolvedValue(mockTodos);
    const timelineComponent = await Timeline({
      searchParams: Promise.resolve({ tl: "week", da: "week" }),
    });
    render(timelineComponent);

    expect(TodoTimeline).toHaveBeenCalledWith(
      {
        todos: mockTodos,
        dateDomainBase: "week",
      },
      undefined,
    );
  });
});
