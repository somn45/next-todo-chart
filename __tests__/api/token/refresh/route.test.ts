/**
 * @jest-environment node
 */

import { DELETE, GET } from "@/app/api/token/refresh/route";
import { NextRequest } from "next/server";
import * as database from "@/libs/database";
import { IMockDatabase } from "@/libs/__mocks__/database";
const { mockCollection } = database as unknown as IMockDatabase;

jest.mock("@/libs/database");
jest.mock("next/server");

describe("/api/token/refresh Route Handler GET", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("사용자의 아이디를 받아 DB에 저장된 refreshToken을 반환한다.", async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue({
      refreshToken: "mockRefreshToken",
    });

    const mockRequest = {
      nextUrl: {
        searchParams: {
          get: jest.fn().mockReturnValue("mockuser"),
        },
      },
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockCollection.findOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.findOne).toHaveBeenCalledWith({ userid: "mockuser" });
  });
  it("userid가 없다면 DB 쿼리를 수행하지 않는다.", async () => {
    (mockCollection.findOne as jest.Mock).mockResolvedValue({
      refreshToken: "mockRefreshToken",
    });

    const mockRequest = {
      nextUrl: {
        searchParams: {
          get: jest.fn().mockReturnValue(null),
        },
      },
    } as unknown as NextRequest;

    await GET(mockRequest);

    expect(mockCollection.findOne).not.toHaveBeenCalled();
  });
});

describe("/api/token/refresh Route Handler Delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("사용자의 아이디를 받아 DB에 저장되어 있던 refreshToken을 삭제한다.", async () => {
    (mockCollection.updateOne as jest.Mock).mockResolvedValue(
      "mockRefreshToken",
    );

    const mockRequest = {
      json: jest.fn().mockResolvedValue("mockuser"),
    } as unknown as NextRequest;

    await DELETE(mockRequest);

    expect(mockCollection.updateOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.updateOne).toHaveBeenCalledWith(
      { userid: "mockuser" },
      { $unset: { refreshToken: "" } },
    );
  });

  it("userid가 없다면 DB 쿼리가 수행되지 않는다.", async () => {
    (mockCollection.updateOne as jest.Mock).mockResolvedValue(
      "mockRefreshToken",
    );

    const mockRequest = {
      json: jest.fn().mockResolvedValue(null),
    } as unknown as NextRequest;

    await DELETE(mockRequest);

    expect(mockCollection.updateOne).not.toHaveBeenCalled();
  });
});
