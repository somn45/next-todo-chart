import { login } from "@/actions/login";
import Form from "@/app/(global)/login/Form";
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
const mockLogin = jest.fn(login);

describe("<LoginPage />", () => {
  it("로그인 양식 제출 후 검증 실패 사유 메세지가 출력된다.", async () => {
    mockLogin.mockImplementation(async (state, formData) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { message: "아이디 또는 비밀번호가 일치하지 않습니다." };
    });
    render(<Form serverAction={mockLogin} initialState={{ message: "" }} />);

    const useridInput = screen.getByLabelText("아이디 입력칸");
    const passwordInput = screen.getByLabelText("비밀번호 입력칸");

    fireEvent.change(useridInput, { target: { value: "abc123" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      const validateMessageSpan = screen.getByTestId("validate-message");
      expect(validateMessageSpan).toHaveTextContent(
        "아이디 또는 비밀번호가 일치하지 않습니다.",
      );
    });
  });
});
