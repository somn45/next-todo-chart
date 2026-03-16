/**
 * @jest-environment node
 */

jest.mock("@/libs/database");
jest.mock("jsonwebtoken");
jest.mock("next/server");

import { POST } from "@/app/api/token/verify/route";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

describe("/api/token/verify Route Handler 성공 테스트", () => {
  it("accessToken을 받아 토큰 검증을 수행한다", async () => {
    const mockNextRequest = {
      json: jest.fn().mockResolvedValue("mockAccessToken"),
    } as unknown as NextRequest;

    await POST(mockNextRequest);

    expect(jwt.verify).toHaveBeenCalledTimes(1);
    expect(jwt.verify).toHaveBeenCalledWith("mockAccessToken", "jwtsecret");
  });
});

describe("/api/token/verify Route Handler 엣지 케이스 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("환경 변수 JWT SECRET KEY가 없다면 에러를 던진다.", async () => {
    const mockNextRequest = {
      json: jest.fn().mockResolvedValue("mockAccessToken"),
    } as unknown as NextRequest;

    delete process.env.NEXT_PUBLIC_JWT_SECRET;

    await expect(POST(mockNextRequest)).rejects.toThrow("No secret key");
  });
});
