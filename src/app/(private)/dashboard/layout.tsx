/**
 * 대시보드에서 구현해야 할 페이지
 * 1. 수정 및 상태 변경이 가능한 투두 목록 (getTodos)
 * 2. 일별 활성화된 투두 총합 라인 그래프 (getTodoStats)
 * 3. 투두의 라이프 사이클을 표현한 타임라인 (getAllTodos)
 */

interface AccessTokenPayload {
  sub: string;
}

import { getIntegratedTodos } from "@/apis/getIntegratedTodos";
import { getTodoStats } from "@/apis/getTodoStats";
import { decodeJwtTokenPayload } from "@/utils/decodeJwtTokenPayload";
import { cookies } from "next/headers";
import React from "react";

export default async function Dashboard({
  children,
  todos,
  lineGraph,
  timeline,
}: {
  children: React.ReactNode;
  todos: React.ReactNode;
  lineGraph: React.ReactNode;
  timeline: React.ReactNode;
}) {
  return (
    <div>
      Home 페이지
      <div>{todos}</div>
      <div>{lineGraph}</div>
      <div>{timeline}</div>
      <div>{children}</div>
    </div>
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
