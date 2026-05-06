jest.mock("@/libs/database");
jest.mock("@/utils/validateUser");
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
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";

const { mockCollection } = database as unknown as IMockDatabase;

describe("login 서버 액션", () => {
  it("제출된 로그인 양식이 검증 통과 시 로그인 성공 메세지를 반환한다.", async () => {
    (validateUser as jest.Mock).mockReturnValue("");
    (mockCollection.findOne as jest.Mock).mockResolvedValue({
      userid: "mockuser",
    });
    const formData = new FormData();
    formData.set("userid", "mockuser");
    formData.set("password", "mockpassword");
    const loginActionResponse = await login({ message: "" }, formData);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("http://localhost:3000/api/token", {
      method: "POST",
      body: JSON.stringify("mockuser"),
    });
    expect(loginActionResponse).toEqual({
      message: "로그인이 완료되었습니다.",
    });

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

    expect(loginFormValidateResponse.message).toMatchInlineSnapshot(
      `"비밀번호는 숫자와 소문자가 적어도 1개 이상 포함되어야 합니다."`,
    );
  });
});
