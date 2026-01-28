/**
 * @jest-environment node
 */

jest.mock("next/server", () => {
  const nextserver = jest.requireActual("next/server");
  return {
    ...nextserver,
    NextResponse: {
      redirect: jest.fn(),
      next: jest.fn().mockReturnValue({
        cookies: {
          set: jest.fn(),
        },
      }),
    },
  };
});
import { middleware } from "@/middleware";
import { NextRequest, NextResponse } from "next/server";

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("/login, /join 경로로 접속했을 경우 토큰 검증 과정 없이 라우팅을 지속한다.", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/login",
      },
      url: "/login",
    } as NextRequest;
    await middleware(mockRequest);
    expect(NextResponse.next).toHaveBeenCalledTimes(1);
  });
  it("accessToken이 있고 만료일도 지나지 않았을 때 라우팅을 지속한다.", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ isVerify: true }),
      }),
    ) as jest.Mock;
    const payload = {
      id: "abc123",
      exp: Date.now() / 1000 + 60 * 60,
    };
    const accessToken = {
      name: "atk",
      value: `header.${btoa(JSON.stringify(payload))}.signature`,
    };
    const mockRequest = {
      nextUrl: {
        pathname: "/todos",
      },
      cookies: {
        get: jest.fn().mockReturnValue(accessToken),
      },
    } as unknown as NextRequest;
    await middleware(mockRequest);
    expect(NextResponse.next).toHaveBeenCalledTimes(1);
  });
  it("accessToken이 없을 경우 모든 쿠키 삭제 및 로그인 페이지로 리다이렉트한다.", async () => {
    const accessToken = undefined;
    const mockRequest = {
      nextUrl: {
        pathname: "/todos",
      },
      url: "http://localhost:3000",
      cookies: {
        get: jest.fn().mockReturnValue(accessToken),
        delete: jest.fn(),
      },
    } as unknown as NextRequest;
    await middleware(mockRequest);
    expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
  });
  it("accessToken이 만료되었을 때 refreshToken이 없다면 모든 쿠키 삭제 및 로그인 페이지로 리다이렉트한다.", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ accessToken: "accessToken", refreshToken: null }),
      }),
    ) as jest.Mock;
    const payload = {
      id: "abc123",
      exp: Date.now() / 1000 - 1000,
    };
    const accessToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    const mockRequest = {
      nextUrl: {
        pathname: "/todos",
      },
      url: "http://localhost:3000",
      cookies: {
        get: jest.fn().mockReturnValue({
          name: "atk",
          value: accessToken,
        }),
        delete: jest.fn(),
      },
    } as unknown as NextRequest;
    await middleware(mockRequest);
    expect(mockRequest.cookies.delete).toHaveBeenCalledTimes(1);
    expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
  });
  it("accessToken, refreshToken 모두 만료되었다면 모든 쿠키 삭제 및 로그인 페이지로 리다이렉트한다.", async () => {
    const payload = {
      id: "abc123",
      exp: Date.now() / 1000 - 1000,
    };
    const accessToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    const refreshToken = `header.${btoa(JSON.stringify(payload))}.signature`;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ refreshToken }),
      }),
    ) as jest.Mock;
    const mockRequest = {
      nextUrl: {
        pathname: "/todos",
      },
      url: "http://localhost:3000",
      cookies: {
        get: jest.fn().mockReturnValue({
          name: "atk",
          value: accessToken,
        }),
        delete: jest.fn(),
      },
    } as unknown as NextRequest;
    await middleware(mockRequest);
    expect(mockRequest.cookies.delete).toHaveBeenCalledTimes(1);
    expect(NextResponse.redirect).toHaveBeenCalledTimes(1);
  });
  it("accessToken이 만료되었을 때 만료되지 않은 refreshToken이 있다면 토큰 재발급 함수를 호출한다", async () => {
    const refreshTokenPayload = {
      id: "abc123",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const refreshToken = `header.${btoa(
      JSON.stringify(refreshTokenPayload),
    )}.signature`;

    const mockedFetch = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ accessToken: "accessToken" }),
    });
    global.fetch = mockedFetch;
    const mockRequest = {
      nextUrl: {
        pathname: "/todos",
      },
      url: "http://localhost:3000",
      cookies: {
        get: jest.fn().mockImplementation((name: string) => {
          const cookiesMap: Map<
            string,
            { name: string; value: string } | null
          > = new Map([
            ["lc_at", null],
            ["lc_rt", { name: "lc_rt", value: refreshToken }],
          ]);
          return cookiesMap.get(name);
        }),
        delete: jest.fn(),
      },
    } as unknown as NextRequest;
    await middleware(mockRequest);

    const response = NextResponse.next();
    expect(NextResponse.next).toHaveBeenCalledTimes(2);
    expect(response.cookies.set).toHaveBeenCalledTimes(1);
    expect(response.cookies.set).toHaveBeenCalledWith({
      name: "lc_at",
      value: "accessToken",
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60,
    });
  });
});
