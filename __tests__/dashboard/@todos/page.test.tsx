import { render, screen } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn(),
}));
jest.mock("@/apis/getIntegratedTodos", () => ({
  getIntegratedTodos: jest.fn().mockResolvedValue([]),
}));
jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue({
      name: "",
      value: "",
    }),
  }),
}));
jest.mock("@/utils/decodeJwtTokenPayload", () => ({
  decodeJwtTokenPayload: jest.fn().mockReturnValue({
    sub: "mockuser",
  }),
}));
jest.mock("@/app/(private)/todos/Form", () =>
  jest.fn(props => <form data-testid="todos-form"></form>),
);
jest.mock("@/components/domain/Todo/TodoWrapper", () =>
  jest.fn(props => <div data-testid="todo-wrapper"></div>),
);

import DashBoardTodos from "@/app/(private)/dashboard/@todos/default";
import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { mockTodo, mockTodos } from "../../../__mocks__/todos";
import { mockStats } from "../../../__mocks__/stats";
import TodosForm from "@/app/(private)/todos/Form";
import TodoWrapper from "@/components/domain/Todo/TodoWrapper";

describe("Dashboard @todos 슬롯 페이지", () => {
  it("", async () => {
    (getIntegratedTodos as jest.Mock).mockResolvedValue({
      activeTodos: mockTodos,
      todosIncludeThisWeek: mockTodos,
      todoStats: mockStats,
    });
    const DashBoardTodosComponent = await DashBoardTodos();
    render(DashBoardTodosComponent);

    const TodoWrapperCalledProps = (TodoWrapper as jest.Mock).mock.calls.map(
      call => call[0],
    );

    expect(getIntegratedTodos).toHaveBeenCalledTimes(1);
    expect(getIntegratedTodos).toHaveBeenCalledWith("mockuser");
    expect(TodosForm).toHaveBeenCalledWith({ userid: "mockuser" }, undefined);
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
