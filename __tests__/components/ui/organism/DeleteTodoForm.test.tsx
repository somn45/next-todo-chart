import { deleteTodo } from "@/actions/deleteTodo";
import DeleteTodoform from "@/components/ui/organisms/DeleteTodoForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/actions/deleteTodo", () => ({
  deleteTodo: jest.fn(),
}));

describe("<DeleteForm />", () => {
  it("삭제 대상 todo에서 삭제 버튼을 누를 경우 deleteTodo 서버 액션이 호출된다.", () => {
    (deleteTodo as jest.Mock).mockResolvedValue({ message: "" });
    render(<DeleteTodoform todoid="1" userid="mockuser" />);

    const deleteTodoInput = screen.queryByTestId("delete-todo-form");
    if (deleteTodoInput) {
      fireEvent.change(deleteTodoInput, "1");
      const form = screen.getByRole("form");
      fireEvent.submit(form);

      waitFor(() => {
        expect(deleteTodo).toHaveBeenCalledTimes(1);
        expect(deleteTodo).toHaveBeenCalledWith("mockuser");
      });
    }
  });
});
