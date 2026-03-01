import { connectDB } from "@/libs/database";
import {
  lookupTodoDocument,
  toStringMongoDBObjectId,
  unwindContent,
} from "./queries/queries";
import { SerializedTodo, TodosType } from "@/types/todos/schema";
import { TodoStat } from "@/types/graph/schema";

export const setTodoStats = async () => {
  const db = (await connectDB).db("next-todo-chart-cluster");

  // 11/27일이 되었다면
  // completedAt이 11/26이라면 O
  // completedAt이 11/29이라면 X
  // createdAt이 11/27이라면 X
  // createdAt은 11/26:59보다 작아야 하고 completedAt은 11/26 0시보다 커야함

  const prevDateSharp = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1,
  );

  const prevDateMidNight = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() - 1,
    23,
    59,
  );

  const recordedTodoStats = await db
    .collection<Array<TodoStat>>("stats")
    .findOne({ date: prevDateSharp });

  if (recordedTodoStats) {
    return recordedTodoStats;
  }

  const todosDoc = (await db
    .collection("todos")
    .aggregate([
      lookupTodoDocument(),
      unwindContent(),
      {
        $match: {
          $or: [
            {
              $or: [
                { "content.state": "할 일" },
                { "content.state": "진행 중" },
              ],
            },
            {
              $and: [
                { "content.state": "완료" },
                { "content.createdAt": { $lte: prevDateMidNight } },
                { "content.completedAt": { $gt: prevDateSharp } },
              ],
            },
          ],
        },
      },
      toStringMongoDBObjectId(),
    ])
    .toArray()) as Array<TodosType & SerializedTodo>;

  const todoStatsMap: Map<string, number> = new Map([
    ["총합", 0],
    ["할 일", 0],
    ["진행 중", 0],
    ["완료", 0],
  ]);

  todosDoc.forEach(todo => {
    const todoStatsCount = todoStatsMap.get(todo.content.state) ?? 0;
    todoStatsMap.set(todo.content.state, todoStatsCount + 1);
  });

  todoStatsMap.set("총합", todosDoc.length);

  const todoStatList = Array.from(todoStatsMap.entries()).map(
    ([state, count]) => {
      return {
        date: prevDateSharp,
        state,
        count,
      };
    },
  );

  await db.collection("stats").insertMany(todoStatList);

  return todoStatList;
};

// 단일 투두 객체 검색 => stat 문서에 이미 해당 투두가 있으면 패스
// stat 문서에 해당 투두가 없다면 _id를 오늘 날짜로 설정하고 투두 등록

// 현재 날짜 11/22
// 11/17 ~ 11/25 가져와야 함
// 11/22 ~ 11/22 가져와야 함
// 11/19 ~ 11/21 가져오면 안됨
// 11/11 ~ null 가져와야 함
