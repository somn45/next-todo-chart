import { ILineGraphData } from "@/types/schema";

export const mockStats: ILineGraphData[] = [
  {
    date: new Date(2026, 1, 17),
    state: "할 일",
    count: 7,
  },
  {
    date: new Date(2026, 1, 17),
    state: "진행 중",
    count: 3,
  },
  {
    date: new Date(2026, 1, 17),
    state: "완료",
    count: 5,
  },
  {
    date: new Date(2026, 1, 17),
    state: "총합",
    count: 14,
  },
];
