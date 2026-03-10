import { getTodos } from "@/apis/getTodos";
import Todos from "@/app/(private)/todos/page";
import { render, screen, waitFor } from "@testing-library/react";
import { headers } from "next/headers";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/apis/getTodos", () => ({
  getTodos: jest.fn(),
}));
jest.mock("@/components/ui/organisms/AddTodoForm", () => {
  return function AddTodoForm() {
    return <div>Todos Form</div>;
  };
});
jest.mock("@/components/domain/Todo/TodoWrapper", () => {
  return function TodoPage({ todo }: { todo: { textField: string } }) {
    return <li>{todo.textField}</li>;
  };
});
jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue("mockuser"),
  }),
}));

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

describe("<Todos />", () => {
  it.each(mockTodos.map((todo, index) => [index, todo]))(
    "%#번째 할 일 아이템에 할 일 내용이 적혀있다..",
    async (index, mockTodo) => {
      (getTodos as jest.Mock).mockResolvedValue(mockTodos);
      ((await headers()).get as jest.Mock).mockReturnValue("mockuser");
      render(await Todos());

      await waitFor(() => {
        const todoItems = screen.getAllByRole("listitem");
        expect(todoItems[index]).toBeInTheDocument();
        expect(todoItems[index]).toHaveTextContent(mockTodo.content.textField);
      });
    },
  );

  it("getTodos API에서 가져오는 todos가 null이나 undefined인 경우 대체 UI를 렌더링한다.", async () => {
    (getTodos as jest.Mock).mockResolvedValue(null);

    waitFor(() => {
      const alternativeUISection = screen.getByTestId("todos-alternative-ui");

      expect(alternativeUISection).toBeInTheDocument();
    });
  });
});
