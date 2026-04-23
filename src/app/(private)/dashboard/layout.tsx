/**
 * 대시보드에서 구현해야 할 페이지
 * 1. 수정 및 상태 변경이 가능한 투두 목록 (getTodos)
 * 2. 일별 활성화된 투두 총합 라인 그래프 (getTodoStats)
 * 3. 투두의 라이프 사이클을 표현한 타임라인 (getAllTodos)
 */

import React from "react";

export default function Dashboard({
  children,
  todos,
  graph,
}: {
  children: React.ReactNode;
  todos: React.ReactNode;
  graph: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-10 lg:grid lg:grid-cols-2">
      <section className="flex flex-col items-stretch gap-5 p-2.5">
        {todos}
      </section>
      <section className="flex flex-col items-stretch gap-5 p-2.5">
        {graph}
      </section>
      <div>{children}</div>
    </section>
  );
}
