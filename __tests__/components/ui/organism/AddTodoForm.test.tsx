import { addTodo } from "@/actions/addTodo";
import AddTodoForm from "@/components/ui/organisms/AddTodoForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/actions/addTodo", () => ({
  addTodo: jest.fn(),
}));

describe("<TodosForm", () => {
  it("투두 입력 후 Form 제출 시 addTodo 서버 액션이 호출된다.", () => {
    (addTodo as jest.Mock).mockResolvedValue({ message: "" });
    render(<AddTodoForm userid="mockuser" />);
    const newTodoInput = screen.getByRole("textbox", { name: /새 투두리스트/ });
    fireEvent.change(newTodoInput, "새 투두리스트");
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    waitFor(() => {
      expect(addTodo).toHaveBeenCalledTimes(1);
      expect(addTodo).toHaveBeenCalledWith("mockuser");
    });
  });
});
