import { login } from "@/actions/login";
import LoginForm from "@/components/ui/organisms/LoginForm";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { act } from "react";

jest.mock("@/libs/database", () => {
  const mockCollection = {
    findOne: jest.fn().mockReturnValue("mockuser"),
    findOneAndUpdate: jest.fn(),
  };
  const mockDb = {
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue(mockCollection),
      createCollection: jest.fn(),
    }),
  };
  return {
    connectDB: Promise.resolve(mockDb),
  };
});
jest.mock("@/actions/login");

describe("<LoginPage />", () => {
  it("로그인 양식 제출 후 검증 실패 사유 메세지가 출력된다.", async () => {
    const user = userEvent.setup();

    (login as jest.Mock).mockImplementation(async (state, formData) => {
      return { message: "아이디 또는 비밀번호가 일치하지 않습니다." };
    });
    render(<LoginForm />);

    const useridInput = screen.getByLabelText("아이디 입력칸");
    const passwordInput = screen.getByLabelText("비밀번호 입력칸");
    screen.debug(passwordInput);

    await user.type(useridInput, "abc123");
    await user.type(passwordInput, "pasword123");

    const submitButton = screen.getByRole("button", { name: "로그인" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
      const validateMessageSpan = screen.getByTestId("validate-message");
      expect(validateMessageSpan).toHaveTextContent(
        "아이디 또는 비밀번호가 일치하지 않습니다.",
      );
    });
  });
});
