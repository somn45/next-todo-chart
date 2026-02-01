import { getTodo } from "@/apis/getTodo";
import TodoPage from "@/components/domain/Todo/Todo";
import { LookupedTodo } from "@/types/schema";
import { render, screen } from "@testing-library/react";
import { act, useRef } from "react";

jest.mock("@/libs/database", () => ({
  connectDB: jest.fn().mockResolvedValue({
    db: jest.fn(),
  }),
}));
jest.mock("@/components/ui/organisms/SelectTodoStateForm", () => {
  return function MockSelectTodoStateForm() {
    return <div data-testid="todo-state-form">update todo state Form</div>;
  };
});
jest.mock("@/components/ui/organisms/EditTodoForm", () => {
  return function MockEditTodoForm() {
    return <div data-testid="edit-form">Edit Form</div>;
  };
});
jest.mock("@/components/ui/organisms/DeleteTodoForm", () => {
  return function MockDeleteTodoForm() {
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
    const mockTodo: LookupedTodo["content"] = {
      _id: "objectId",
      userid: "mockuser",
      textField: "mock text",
      state: "할 일",
      createdAt: "",
      updatedAt: "",
      completedAt: new Date(),
    };
    render(<TodoPage todo={mockTodo} />);

    const textFieldSpan = screen.getByTestId("todo-textfield");
    const todoStateSpan = screen.getByTestId("todo-state");
    const editTodoForm = screen.getByTestId("edit-form");
    const deleteTodoForm = screen.getByTestId("delete-form");
    expect(textFieldSpan).toHaveTextContent("mock text");
    expect(todoStateSpan).toHaveTextContent("할 일");
    expect(editTodoForm).toBeInTheDocument();
    expect(deleteTodoForm).toBeInTheDocument();
  });
  it("만약 상태가 '완료'라면 유예 시간 알림 메세지를 출력하고 유예 시간이 지나면 해당 요소가 표시되지 않는다.", () => {
    jest.useFakeTimers();
    const MOCK_DATE = new Date(2025, 10, 16, 9);
    jest.setSystemTime(MOCK_DATE);

    const mockTodo: LookupedTodo["content"] = {
      _id: "objectId",
      userid: "mockuser",
      textField: "mock text",
      state: "완료",
      createdAt: "",
      updatedAt: "",
      completedAt: new Date(2025, 10, 16, 9, 10),
    };

    render(<TodoPage todo={mockTodo} />);

    const alertGracePeriodMessage = /이 할 일은 완료 상태입니다./i;
    const alertGracePeriodMessageParagraph = screen.getByText(
      alertGracePeriodMessage,
    );

    expect(alertGracePeriodMessageParagraph).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 11);
    });

    const listItemAfterTenMinutes = screen.queryByRole("listitem");

    expect(listItemAfterTenMinutes).not.toBeInTheDocument();
  });

  it("완료 상태인 투두가 완료를 제외한 상태로 변경하면 유예 시간 후에 실행되는 타이머 함수를 클리어한다.", () => {
    jest.useFakeTimers();
    const MOCK_DATE = new Date(2025, 10, 16, 9);
    jest.setSystemTime(MOCK_DATE);

    const mockTodoFinishState: LookupedTodo["content"] = {
      _id: "objectId",
      userid: "mockuser",
      textField: "mock text",
      state: "완료",
      createdAt: "",
      updatedAt: "",
      completedAt: new Date(2025, 10, 16, 9, 10),
    };

    const { rerender } = render(<TodoPage todo={mockTodoFinishState} />);

    const alertGracePeriodMessage = /이 할 일은 완료 상태입니다./i;
    const alertGracePeriodMessageParagraph = screen.getByText(
      alertGracePeriodMessage,
    );

    expect(alertGracePeriodMessageParagraph).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 5);
    });

    const mockTodoDoingState: LookupedTodo["content"] = {
      _id: "objectId",
      userid: "mockuser",
      textField: "mock text",
      state: "진행 중",
      createdAt: "",
      updatedAt: "",
      completedAt: null,
    };

    act(() => {
      rerender(<TodoPage todo={mockTodoDoingState} />);
    });

    expect(screen.queryByText(alertGracePeriodMessage)).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 6);
    });

    const todoListItem = screen.getByRole("listitem");
    expect(todoListItem).toBeInTheDocument();
  });
});
