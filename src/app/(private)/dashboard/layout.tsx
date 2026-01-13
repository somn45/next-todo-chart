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
    <section
      style={{
        display: "flex",
      }}
    >
      <section
        style={{
          width: "50%",
          marginLeft: "100px",
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {todos}
      </section>
      <section
        style={{
          width: "50%",
          alignSelf: "stretch",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {graph}
      </section>
      <div>{children}</div>
    </section>
  );
}

/*
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("atk");

  // 에러 작업 예정
  if (!accessToken) return [];
  const { sub: userid }: AccessTokenPayload =
    decodeJwtTokenPayload(accessToken);

  const dashboardDataList = await getIntegratedTodos(userid);

*/
