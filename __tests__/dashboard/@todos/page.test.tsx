jest.mock("@/libs/database");
jest.mock("@/apis/getIntegratedTodos", () => ({
  getIntegratedTodos: jest.fn().mockResolvedValue([]),
}));
jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("mockuser"),
  }),
}));
jest.mock("@/components/ui/organisms/AddTodoForm", () =>
  jest.fn(() => <form data-testid="todos-form"></form>),
);
jest.mock("@/components/domain/Todo/TodoWrapper", () =>
  jest.fn(() => <div data-testid="todo-wrapper"></div>),
);

import { render } from "@testing-library/react";

import DashBoardTodos from "@/app/(private)/dashboard/@todos/default";
import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { mockTodos } from "../../../__mocks__/todos";
import { mockTodoStats } from "../../../__mocks__/stats";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";

describe("Dashboard @todos 슬롯 페이지", () => {
  it("getIntegratedTodos API에서 activeTodos를 받아 TodoWrapper 컴포넌트를 렌더링한다.", async () => {
    (getIntegratedTodos as jest.Mock).mockResolvedValue({
      activeTodos: mockTodos,
      todosIncludeThisWeek: mockTodos,
      todoStats: mockTodoStats,
    });
    const DashBoardTodosComponent = await DashBoardTodos();
    render(DashBoardTodosComponent);

    const TodoWrapperCalledProps = (TodoWrapper as jest.Mock).mock.calls.map(
      call => call[0],
    );

    expect(getIntegratedTodos).toHaveBeenCalledTimes(1);
    expect(getIntegratedTodos).toHaveBeenCalledWith("mockuser");
    expect(AddTodoForm).toHaveBeenCalledWith({ userId: "mockuser" }, undefined);
    expect(TodoWrapperCalledProps[0]).toEqual({
      todo: mockTodos[0].content,
      showDeleteSection: false,
    });
    expect(TodoWrapperCalledProps[1]).toEqual({
      todo: mockTodos[1].content,
      showDeleteSection: false,
    });
  });
});
