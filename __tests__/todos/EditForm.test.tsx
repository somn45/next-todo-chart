import { editTodo } from "@/actions/editTodo";
import EditForm from "@/app/(private)/todos/EditForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/actions/editTodo", () => ({
  editTodo: jest.fn(),
}));

describe("<EditForm />", () => {
  it("편집 모드 활성화 후 투두 양식을 수정하고 제출하면 editTodo 서버 액션이 호출된다.", () => {
    (editTodo as jest.Mock).mockResolvedValue({ message: "" });
    render(<EditForm todoid="1" userid="mockuser" />);

    const changeEditModeButton = screen.getByRole("button", { name: /수정/ });
    fireEvent.click(changeEditModeButton);
    const editTodoInput = screen.getByRole("textbox", { name: /수정될 투두/ });
    fireEvent.change(editTodoInput, "수정된 투두리스트");
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    waitFor(() => {
      expect(editTodo).toHaveBeenCalledTimes(1);
      expect(editTodo).toHaveBeenCalledWith({
        todoid: "1",
        userid: "mockuser",
      });
    });
  });
});
