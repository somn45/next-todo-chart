jest.mock("@/libs/database", () => {
  const mockCollection = {
    findOne: jest.fn().mockResolvedValue({
      userid: "abc123",
      password: "password123",
    }),
    findOneAndUpdate: jest.fn(),
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
jest.mock("bcrypt", () => ({
  compare: jest.fn().mockResolvedValue(true),
}));
jest.mock("next/headers", () => {
  return {
    cookies: jest.fn().mockResolvedValue({
      set: jest.fn(),
    }),
  };
});
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        accessToken: "",
      }),
  }),
) as jest.Mock;

import { login } from "@/actions/login";
import { validateUser } from "@/utils/validateUser";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

describe("login 서버 액션", () => {
  it("제출된 로그인 양식이 검증 통과 시 redirect를 호출한다.", async () => {
    (validateUser as jest.Mock).mockReturnValue("");
    const formData = new FormData();
    formData.set("userid", "abc123");
    formData.set("password", "password123");
    await login({ message: "" }, formData);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/token", {
      method: "POST",
      body: JSON.stringify("abc123"),
    });
    expect(redirect).toHaveBeenCalledTimes(1);

    const cookieStore = await cookies();
    expect(cookieStore.set).toHaveBeenCalledTimes(2);
    expect(cookieStore.set).toHaveBeenCalledWith("lc_at", "", {
      maxAge: 60 * 60,
      httpOnly: true,
    });
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
