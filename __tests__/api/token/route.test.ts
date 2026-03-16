/**
 * @jest-environment node
 */

jest.mock("next/server");
jest.mock("jsonwebtoken");

import { POST } from "@/app/api/token/route";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

describe("/api/token Route Handler 성공 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("jsonwebtoken을 이용해 accessToken, refreshToken을 생성하고 반환한다.", async () => {
    (jwt.sign as jest.Mock)
      .mockReturnValueOnce("header.accesstoken.signature")
      .mockReturnValueOnce("header.refreshtoken.signature");

    const mockNextRequest = {
      json: jest.fn().mockResolvedValue("mockuser"),
    } as unknown as NextRequest;

    await POST(mockNextRequest);

    expect(jwt.sign).toHaveBeenCalledTimes(2);
    expect(jwt.sign).toHaveBeenCalledWith({ id: "mockuser" }, "jwtsecret", {
      expiresIn: "1h",
      subject: "mockuser",
    });
    expect(jwt.sign).toHaveBeenCalledWith({ id: "mockuser" }, "jwtsecret", {
      expiresIn: "7 days",
    });
  });
});

describe("/api/token Route Handler 엣지 케이스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("환경 변수 NEXT_PUBLIC_JWT_SECRET이 없으면 에러를 던진다.", async () => {
    (jwt.sign as jest.Mock)
      .mockReturnValue("header.accesstoken.signature")
      .mockReturnValue("header.refreshtoken.signature");

    const mockNextRequest = {
      json: jest.fn().mockResolvedValue("mockuser"),
    } as unknown as NextRequest;

    delete process.env.NEXT_PUBLIC_JWT_SECRET;

    await expect(POST(mockNextRequest)).rejects.toThrow("No secret key");
  });
});
