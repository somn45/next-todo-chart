jest.mock("@/libs/database", () => {
  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]),
    }),
    insertOne: jest.fn().mockResolvedValue({}),
    findOne: jest.fn().mockResolvedValue({}),
  };
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
    createCollection: jest.fn(),
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

import { join } from "@/actions/join";
import { validateUser } from "@/utils/validateUser";
import { redirect } from "next/navigation";

describe("join 서버 액션", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("제출된 회원가입 양식이 검증 과정 통과 시 redirect를 호출한다.", async () => {
    (validateUser as jest.Mock).mockReturnValue("");
    const formData = new FormData();
    await join({ message: "" }, formData);
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(redirect).toHaveBeenCalledWith("/login");
  });
  it("제출된 회원가입 양식이 검증 과정 실패 시 검증 실패 사유 메세지를 return한다.", async () => {
    (validateUser as jest.Mock).mockReturnValue(
      "아이디는 6자 ~ 20자 이내로 입력해야 합니다.",
    );
    const formData = new FormData();
    const validateErrorResponse = await join({ message: "" }, formData);
    expect(redirect).not.toHaveBeenCalled();
    expect(validateErrorResponse.message).toEqual(
      "아이디는 6자 ~ 20자 이내로 입력해야 합니다.",
    );
  });
});
