import { TodoStat } from "@/types/stats/schema";

export const mockTodoStats: TodoStat[] = [
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

// 날짜 설정 : 2026/01/18
export const mockPast7DaysTodoStats: TodoStat[] = [
  // === 1월 11일 ===
  { date: new Date(2026, 0, 11), state: "할 일", count: 4 },
  { date: new Date(2026, 0, 11), state: "진행 중", count: 2 },
  { date: new Date(2026, 0, 11), state: "완료", count: 8 },
  { date: new Date(2026, 0, 11), state: "총합", count: 14 },

  // === 1월 12일 ===
  { date: new Date(2026, 0, 12), state: "할 일", count: 6 },
  { date: new Date(2026, 0, 12), state: "진행 중", count: 3 },
  { date: new Date(2026, 0, 12), state: "완료", count: 9 },
  { date: new Date(2026, 0, 12), state: "총합", count: 18 },

  // === 1월 13일 ===
  { date: new Date(2026, 0, 13), state: "할 일", count: 5 },
  { date: new Date(2026, 0, 13), state: "진행 중", count: 4 },
  { date: new Date(2026, 0, 13), state: "완료", count: 11 },
  { date: new Date(2026, 0, 13), state: "총합", count: 20 },

  // === 1월 14일 ===
  { date: new Date(2026, 0, 14), state: "할 일", count: 8 },
  { date: new Date(2026, 0, 14), state: "진행 중", count: 2 },
  { date: new Date(2026, 0, 14), state: "완료", count: 12 },
  { date: new Date(2026, 0, 14), state: "총합", count: 22 },

  // === 1월 15일 ===
  { date: new Date(2026, 0, 15), state: "할 일", count: 7 },
  { date: new Date(2026, 0, 15), state: "진행 중", count: 5 },
  { date: new Date(2026, 0, 15), state: "완료", count: 14 },
  { date: new Date(2026, 0, 15), state: "총합", count: 26 },

  // === 1월 16일 ===
  { date: new Date(2026, 0, 16), state: "할 일", count: 9 },
  { date: new Date(2026, 0, 16), state: "진행 중", count: 3 },
  { date: new Date(2026, 0, 16), state: "완료", count: 16 },
  { date: new Date(2026, 0, 16), state: "총합", count: 28 },

  // === 1월 17일 ===
  { date: new Date(2026, 0, 17), state: "할 일", count: 7 },
  { date: new Date(2026, 0, 17), state: "진행 중", count: 3 },
  { date: new Date(2026, 0, 17), state: "완료", count: 19 },
  { date: new Date(2026, 0, 17), state: "총합", count: 29 },
];
