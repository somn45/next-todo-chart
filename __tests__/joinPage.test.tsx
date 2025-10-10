import { join } from "@/actions/join";
import Form from "@/app/(global)/join/Form";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/libs/database", () => {
  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    }),
    isnertOne: jest.fn().mockReturnValue({}),
  };
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
    createCollection: jest.fn(),
  };
  return {
    connectDB: Promise.resolve(mockDb),
  };
});
const mockAction = jest.fn(join);

describe("<JoinPage />", () => {
  it("Form 제출 후 useActionState 인자에 할당된 서버 액션이 호출된다.", async () => {
    mockAction.mockImplementation(async (prevState, initialState) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { message: "회원가입 완료" };
    });
    render(<Form serverAction={mockAction} initialState={{ message: "" }} />);

    // screen.logTestingPlaygroundURL();

    const useridInput = screen.getByRole("textbox", { name: "userid" });
    const passwordInput = screen.getByLabelText("password");
    const confirmPasswordInput = screen.getByLabelText("confirm-password");
    const emailInput = screen.getByRole("textbox", { name: "email" });

    fireEvent.change(useridInput, { target: { value: "abc123" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(emailInput, { target: { value: "mockemail@gmail.com" } });

    const form = screen.getByRole("form", { name: /회원가입 양식/i });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalledTimes(1);
      const validateMessageSpan = screen.getByTestId("validate-message");
      expect(validateMessageSpan).toHaveTextContent("회원가입 완료");
    });
  });
});
