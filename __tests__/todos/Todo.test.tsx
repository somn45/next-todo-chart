import TodoPage from "@/components/domain/Todo/Todo";
import { SerializedTodo, StateType } from "@/types/todos/schema";
import { render, screen } from "@testing-library/react";
import { act } from "react";

jest.mock("@/libs/database");
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

const selectMockTodo = (state: StateType) => {
  if (state === "완료")
    return {
      _id: "objectId",
      userid: "mockuser",
      textField: "mock text",
      state,
      createdAt: "",
      updatedAt: "",
      completedAt: new Date(2025, 10, 16, 9, 10).toISOString(),
    };
  return {
    _id: "objectId",
    userid: "mockuser",
    textField: "mock text",
    state,
    createdAt: "",
    updatedAt: "",
    completedAt: null,
  };
};

describe("<Todo />", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const MOCK_DATE = new Date(2025, 10, 16, 9);
    jest.setSystemTime(MOCK_DATE);
  });

  it("Todos 컴포넌트로부터 todo의 id와 userid를 받아 단일 todo를 가져온 후 페이지에 출력한다.", async () => {
    const mockTodo: SerializedTodo["content"] = selectMockTodo("할 일");
    const { container } = render(<TodoPage todo={mockTodo} />);
    expect(container).toMatchInlineSnapshot(`
      <div>
        <li
          class="flex border-[#3498DB] max-w-md flex-col gap-2 rounded-md border-l-4 pl-4"
        >
          <p
            class="text-error-light text-sm font-semibold"
          />
          <div
            class="flex h-12 items-center"
          >
            <span
              class="text-regular"
            >
              mock text
            </span>
          </div>
          <div
            class="flex items-center gap-4"
          >
            <span
              class="text-caption"
            >
              NaN-NaN-NaN
            </span>
            <div
              class="flex items-center justify-center rounded-md p-1 hover:bg-mauve-400"
            >
              <button
                class="rounded-md px-2 py-1 flex justify-center items-center hover:underline h-8 text-sm font-semibold cursor-pointer"
                type="button"
              >
                <svg
                  aria-hidden="true"
                  class="lucide lucide-square-pen"
                  fill="none"
                  height="16"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                  />
                </svg>
              </button>
            </div>
            <div
              data-testid="delete-form"
            >
              Delete Form
            </div>
          </div>
          <div
            data-testid="todo-state-form"
          >
            update todo state Form
          </div>
        </li>
      </div>
    `);
  });
  it("만약 투두의 상태가 '완료'라면 유예 시간 알림 메세지를 출력하고 유예 시간이 지나면 해당 요소가 표시되지 않는다.", () => {
    const mockTodo: SerializedTodo["content"] = selectMockTodo("완료");

    render(<TodoPage todo={mockTodo} />);

    const gracePeriodMessage = /이 할 일은 완료 상태입니다./i;
    const gracePeriodMessageBox = screen.getByText(gracePeriodMessage);

    expect(gracePeriodMessageBox).toMatchInlineSnapshot(`
      <p
        class="text-error-light text-sm font-semibold"
      >
        이 할 일은 완료 상태입니다. 2025-11-16T00:10:00.000Z 까지 완료 상태 지속 시 영구히 완료 상태가 됩니다.
      </p>
    `);

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 11);
    });

    const listItemAfterTenMinutes = screen.queryByRole("listitem");

    expect(listItemAfterTenMinutes).not.toBeInTheDocument();
  });

  it("완료 상태인 투두가 완료를 제외한 상태로 변경하면 유예 시간 후에 실행되는 타이머 함수를 클리어한다.", () => {
    const mockTodoFinishState: SerializedTodo["content"] =
      selectMockTodo("완료");

    const { rerender } = render(<TodoPage todo={mockTodoFinishState} />);

    const alertGracePeriodMessage = /이 할 일은 완료 상태입니다./i;
    const alertGracePeriodMessageParagraph = screen.getByText(
      alertGracePeriodMessage,
    );

    expect(alertGracePeriodMessageParagraph).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 5);
    });

    const mockTodoDoingState: SerializedTodo["content"] =
      selectMockTodo("진행 중");

    rerender(<TodoPage todo={mockTodoDoingState} />);

    expect(screen.queryByText(alertGracePeriodMessage)).not.toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000 * 60 * 6);
    });

    const todoListItem = screen.getByRole("listitem");
    expect(todoListItem).toBeInTheDocument();
  });
});
