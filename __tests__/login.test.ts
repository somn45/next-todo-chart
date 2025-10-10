jest.mock("@/libs/database", () => {
  const mockCollection = {
    findOne: jest.fn().mockResolvedValue({
      userid: "abc123",
      password: "password123",
    }),
  };
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };
  return {
    connectDB: Promise.resolve({
      db: jest.fn().mockReturnValue(mockDb),
    }),
  };
});
jest.mock("@/utils/validateUser");
jest.mock("next/navigation", () => {
  const nextNavigationModule = jest.requireActual("next/navigation");
  return {
    ...nextNavigationModule,
    redirect: jest.fn(),
  };
});

import { login } from "@/actions/login";
import { validateUser } from "@/utils/validateUser";
import { redirect } from "next/navigation";

describe("login 서버 액션", () => {
  it("제출된 로그인 양식이 검증 통과 시 redirect를 호출한다.", async () => {
    (validateUser as jest.Mock).mockReturnValue("");
    const formData = new FormData();
    formData.set("userid", "abc123");
    formData.set("password", "password123");
    await login({ message: "" }, formData);

    expect(redirect).toHaveBeenCalledTimes(1);
  });
  it("제출된 로그인 양식이 검증 실패 시 검증 실패 사유 메세지를 return한다.", async () => {
    (validateUser as jest.Mock).mockReturnValue(
      "비밀번호는 숫자와 소문자가 적어도 1개 이상 포함되어야 합니다.",
    );
    const formData = new FormData();
    formData.set("userid", "abc123");
    formData.set("password", "password123");
    const loginFormValidateResponse = await login({ message: "" }, formData);

    expect(loginFormValidateResponse.message).toEqual(
      "비밀번호는 숫자와 소문자가 적어도 1개 이상 포함되어야 합니다.",
    );
  });
});
