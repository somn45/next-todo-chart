import { TodoStat } from "@/types/stats/schema";
import { SerializedTodo, TodosType } from "@/types/todos/schema";

export const mockTimelineTodos: Array<TodosType & SerializedTodo> = [
  {
    _id: "1",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "일요일 아침 주간 계획 세우기",
      state: "완료",
      // 2026년 1월 18일 생성 (일요일 - 금주의 첫날)
      createdAt: new Date(2026, 0, 18, 9, 30, 0).toISOString(),
      // 2026년 1월 18일 당일 완료
      updatedAt: new Date(2026, 0, 18, 11, 0, 0).toISOString(),
      completedAt: new Date(2026, 0, 18, 11, 0, 0).toISOString(),
    },
  },
  {
    _id: "2",
    author: "mockuser",
    content: {
      _id: "2",
      userid: "mockuser",
      textField: "Playwright E2E 마우스 이벤트 테스트 작성",
      state: "진행 중",
      // 2026년 1월 18일 생성 (일요일 오후)
      createdAt: new Date(2026, 0, 19, 14, 0, 0).toISOString(),
      // 2026년 1월 19일 수정 (월요일에 작업 진행 중)
      updatedAt: new Date(2026, 0, 19, 10, 30, 0).toISOString(),
      completedAt: null,
    },
  },
  {
    _id: "3",
    author: "mockuser",
    content: {
      _id: "3",
      userid: "mockuser",
      textField: "팀 주간 싱크 미팅 준비 및 자료 공유",
      state: "완료",
      // 2026년 1월 19일 생성 (월요일)
      createdAt: new Date(2026, 0, 19, 8, 30, 0).toISOString(),
      // 2026년 1월 19일 당일 오후 완료
      updatedAt: new Date(2026, 0, 19, 15, 0, 0).toISOString(),
      completedAt: new Date(2026, 0, 19, 15, 0, 0).toISOString(),
    },
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
