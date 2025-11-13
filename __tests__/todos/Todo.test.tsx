import { getTodo } from "@/apis/getTodo";
import TodoPage from "@/app/(private)/todos/(todo)/Todo";
import { render, screen } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/app/(private)/todos/EditForm", () => {
  return function MockEditForm() {
    return <div data-testid="edit-form">Edit Form</div>;
  };
});
jest.mock("@/app/(private)/todos/DeleteForm", () => {
  return function MockDeleteForm() {
    return <div data-testid="delete-form">Delete Form</div>;
  };
});
jest.mock("@/apis/getTodo", () => ({
  getTodo: jest.fn(),
}));
describe("<Todo />", () => {
  it("Todos 컴포넌트로부터 todo의 id와 userid를 받아 단일 todo를 가져온 후 페이지에 출력한다.", async () => {
    (getTodo as jest.Mock).mockResolvedValue({
      _id: "objectId",
      userid: "mockuser",
      textField: "mock text",
    });
    render(
      await TodoPage({
        _id: "objectId",
        userid: "mockuser",
        textField: "",
      }),
    );

    const textFieldSpan = screen.getByTestId("todo-textField");
    const editTodoForm = screen.getByTestId("edit-form");
    const deleteTodoForm = screen.getByTestId("delete-form");
    expect(textFieldSpan).toHaveTextContent("mock text");
    expect(editTodoForm).toBeInTheDocument();
    expect(deleteTodoForm).toBeInTheDocument();
  });
});
