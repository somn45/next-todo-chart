import { join } from "@/actions/join";
import JoinForm from "@/components/ui/organisms/JoinForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/actions/join");
jest.mock("@/libs/database", () => {
  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    }),
    findOne: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue("mockuser"),
    }),
    insertOne: jest.fn().mockReturnValue({}),
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

describe("<JoinPage />", () => {
  it("Form 제출 후 useActionState 인자에 할당된 서버 액션이 호출된다.", async () => {
    (join as jest.Mock).mockImplementation(async (prevState, initialState) => {
      await new Promise(resolve => setTimeout(resolve, 50));
      return { message: "회원가입 완료" };
    });
    render(<JoinForm />);

    // screen.logTestingPlaygroundURL();

    const useridInput = screen.getByLabelText("아이디 입력칸");
    const passwordInput = screen.getByLabelText("비밀번호 입력칸");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인 입력칸");
    const emailInput = screen.getByLabelText("이메일 입력칸");

    fireEvent.change(useridInput, { target: { value: "abc123" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.change(emailInput, { target: { value: "mockemail@gmail.com" } });

    const form = screen.getByRole("form", { name: /회원가입 양식/i });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(join).toHaveBeenCalledTimes(1);
      const validateMessageSpan = screen.getByTestId("validate-message");
      expect(validateMessageSpan).toHaveTextContent("회원가입 완료");
    });
  });
});
