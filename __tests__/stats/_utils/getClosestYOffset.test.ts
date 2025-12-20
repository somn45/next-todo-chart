import { getClosestYOffset } from "@/app/(private)/stats/_utils/getClosestYOffset";

const mockPoints = [
  {
    title: "일찍 일어나기",
    y_pixel: 350,
  },
  {
    title: "양치하기",
    y_pixel: 100,
  },
  {
    title: "아침 먹기",
    y_pixel: 220,
  },
  {
    title: "교통카드 충전",
    y_pixel: 490,
  },
];

describe("getClosestYOffset", () => {
  it("getClosestYOffset 유틸 함수를 사용하면 매개 변수로 받은 points 중 마우스의 Y 좌표와 가장 가까운 point를 반환한다.", () => {
    const mouseYPointer = 250;
    const closestYOffset = getClosestYOffset(mockPoints, mouseYPointer);

    expect(closestYOffset).toEqual({
      title: "아침 먹기",
      y_pixel: 220,
    });
  });
});
