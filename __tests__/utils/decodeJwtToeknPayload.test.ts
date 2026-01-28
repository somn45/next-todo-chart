import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";

describe("JWT 토큰을 디코딩하여 payload 값을 해독하는 유틸 함수", () => {
  it("Jwt 토큰이 decodeJwtTokenPayload 인수에 담겨 있을 경우 디코딩된 payload를 반환한다.", () => {
    const payload = {
      id: "abc123",
      exp: Date.now() / 1000 + 60 * 60,
    };
    const accessToken = {
      name: "atk",
      value: `header.${btoa(JSON.stringify(payload))}.signature`,
    };
    const jwtTokenPayload = decodeJwtTokenPayload(accessToken);
    expect(jwtTokenPayload?.id).toEqual("abc123");
  });
  it("decodeJwtTokenPayload 인수로 문자열 구조의 토큰이 담겨 있을 경우에도 디코딩된 payload를 반환한다.", () => {
    const payload = {
      id: "abc123",
      exp: Date.now() / 1000 + 60 * 60,
    };
    const accessToken = `header.${btoa(JSON.stringify(payload))}.signature`;
    const jwtTokenPayload = decodeJwtTokenPayload({
      name: "accessToken",
      value: accessToken,
    });
    expect(jwtTokenPayload?.id).toEqual("abc123");
  });
  it("Jwt 구조가 아닌 토큰이 decodeJwtTokenPayload 인수에 담겨 있을 경우 에러를 반환한다.", () => {
    const payload = {
      id: "abc123",
      exp: Date.now() / 1000 + 60 * 60,
    };
    const accessToken = {
      name: "atk",
      value: `header.${btoa(JSON.stringify(payload))}`, // signature 유실
    };

    const jwtTokenPayload = () => decodeJwtTokenPayload(accessToken);
    expect(jwtTokenPayload).toThrow("올바르지 않은 JWT 토큰 형식입니다.");
  });
});
