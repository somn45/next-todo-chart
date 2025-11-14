import { getTodos } from "@/apis/getTodos";
import Todos from "@/app/(private)/todos/page";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { render, screen } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/apis/getTodos", () => ({
  getTodos: jest.fn(),
}));
jest.mock("@/app/(private)/todos/Form", () => {
  return function TodosForm() {
    return <div>Todos Form</div>;
  };
});
jest.mock("@/components/domain/Todo/TodoWrapper", () => {
  return function TodoPage({ todo }: { todo: { textField: string } }) {
    return <li>{todo.textField}</li>;
  };
});
jest.mock("next/headers", () => {
  const nextHeaders = jest.requireActual("next/headers");
  return {
    ...nextHeaders,
    cookies: jest.fn(() => ({
      get: jest.fn(() => ({
        name: "",
        value: "",
      })),
    })),
  };
});
jest.mock("@/utils/decodeJwtTokenPayload");

describe("<Todos />", () => {
  it("Todos 페이지에 접속 시 로그인 중인 사용자의 투두리스트가 페이지에 출력된다.", async () => {
    const mockTodos = [
      {
        _id: "1",
        author: "mockuser",
        content: {
          _id: "1",
          userid: "mockuser",
          textField: "1번 투두리스트",
        },
      },
      {
        _id: "2",
        author: "mockuser",
        content: {
          _id: "2",
          userid: "mockuser",
          textField: "2번 투두리스트",
        },
      },
    ];

    (getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (decodeJwtTokenPayload as jest.Mock).mockReturnValue({
      sub: { userid: "mockuser" },
    });
    render(await Todos());
    const todoItems = screen.getAllByRole("listitem");
    todoItems.forEach((todoItem, index) => {
      expect(todoItem).toBeInTheDocument();
      expect(todoItem).toHaveTextContent(mockTodos[index].content.textField);
    });
  });
});
