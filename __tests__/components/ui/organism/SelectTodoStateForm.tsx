import { fireEvent, render, screen } from "@testing-library/react";
import { mockTodo } from "../../../../__mocks__/todos";
import { updateTodoState } from "@/actions/updateTodoState";
import SelectTodoStateForm from "@/components/ui/organisms/SelectTodoStateForm";

jest.mock("@/libs/database", () => ({
  connectDB: Promise.resolve({
    db: jest.fn(),
  }),
}));
jest.mock("@/actions/updateTodoState", () => ({
  updateTodoState: jest.fn(),
}));

describe("<TodoStateForm />", () => {
  it("상태 버튼 클릭 시 상태 속성이 포함된 formData와 함께 서버 액션이 호출된다.", () => {
    (updateTodoState as jest.Mock).mockResolvedValue({ message: "" });

    render(
      <SelectTodoStateForm todoid={mockTodo._id} currentTodoState="할 일" />,
    );

    const formWithDoingState = screen.getByRole("form", {
      name: "진행 중이 포함된 양식",
    });
    fireEvent.submit(formWithDoingState);

    const formData = new FormData();
    formData.set("state", "진행 중");

    expect(updateTodoState).toHaveBeenCalledTimes(1);
    expect(updateTodoState).toHaveBeenCalledWith(
      mockTodo._id,
      { message: "" },
      formData,
    );
  });
});
