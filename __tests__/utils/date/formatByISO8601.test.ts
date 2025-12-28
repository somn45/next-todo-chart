import { formatByISO8601 } from "@/utils/date/formatByISO8601";

jest.useFakeTimers();

describe("formatByISO8601 유틸 함수", () => {
  it("formatByISO8601 함수에 Date 타입을 넣으면 yyyy-mm-dd 날짜 포맷으로 변경된다.", () => {
    const fakeDate = new Date(2025, 11, 14);
    const fakeDateISO8601Format = formatByISO8601(fakeDate);
    expect(fakeDateISO8601Format).toEqual("2025-12-14");
  });
});
