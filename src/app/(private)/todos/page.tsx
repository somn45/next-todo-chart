import { getTodos } from "@/apis/getTodos";

import getUserIdByHeaders from "@/utils/auth/getUserIdByHeaders";
import TodosPage from "./TodosPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "나의 할 일 목록",
  description:
    "오늘의 할 일을 등록할 시간입니다. 할 일의 진행도가 3단계로 구성되어 할 일 진행도를 직관적으로 확인할 수 있습니다.",
};

export default async function Todos() {
  const userId = await getUserIdByHeaders();
  const todos = await getTodos(userId);

  if (!todos)
    return (
      <section>
        <span data-testid="todos-alternative-ui">
          오늘 할 일이 아직 정해지지 않았어요. 어서 할 일을 생성해 봐요!
        </span>
      </section>
    );
  return <TodosPage userId={userId} todos={todos} />;
}
