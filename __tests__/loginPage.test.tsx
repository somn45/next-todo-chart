jest.mock("@/libs/database");
jest.mock("@/actions/login");
jest.mock("next/navigation");

import { login } from "@/actions/login";
import LoginPage from "@/app/(global)/login/page";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

describe("<LoginPage />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("로그인 성공 시 메인 페이지로 리다이렉트된다.", async () => {
    const user = userEvent.setup();
    (login as jest.Mock).mockImplementation(async (state, formData) => {
      return { message: "" };
    });

    render(<LoginPage />);

    const useridInput = screen.getByLabelText("아이디 입력칸");
    const passwordInput = screen.getByLabelText("비밀번호 입력칸");

    await user.type(useridInput, "abc123");
    await user.type(passwordInput, "pasword123");

    const submitButton = screen.getByRole("button", { name: "로그인" });
    await user.click(submitButton);

    expect(login).toHaveBeenCalledTimes(1);
  });
  it("로그인 실패 시 검증 실패 사유 메세지가 출력된다.", async () => {
    const user = userEvent.setup();

    (login as jest.Mock).mockImplementation(async (state, formData) => {
      return { message: "아이디 또는 비밀번호가 일치하지 않습니다." };
    });
    const { container } = render(<LoginPage />);

    const useridInput = screen.getByLabelText("아이디 입력칸");
    const passwordInput = screen.getByLabelText("비밀번호 입력칸");

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

      expect(container).toMatchSnapshot();
    });
  });
});
