import { SerializedTodo, TodosType } from "@/types/todos/schema";

export const mockTodos: Array<TodosType & SerializedTodo> = [
  {
    _id: "1",
    author: "mockuser",
    content: {
      _id: "1",
      userid: "mockuser",
      textField: "mock text",
      state: "완료",
      createdAt: new Date(2025, 6, 10).toISOString(),
      updatedAt: new Date(2025, 6, 12).toISOString(),
      completedAt: new Date(2025, 6, 15).toISOString(),
    },
  },
  {
    _id: "2",
    author: "mockuser",
    content: {
      _id: "2",
      userid: "mockuser",
      textField: "hello world",
      state: "진행 중",
      createdAt: new Date(2025, 6, 13).toISOString(),
      updatedAt: new Date(2025, 6, 14).toISOString(),
      completedAt: null,
    },
  },
];

export const mockTodo = {
  _id: "123456789012345678901234",
  userid: "mockuser",
  textField: "hello world!",
};

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
