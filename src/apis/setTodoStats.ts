import { connectDB } from "@/libs/database";
import {
  LookupedTodoWithObjectId,
  TodoStats,
  WithStringifyId,
} from "@/types/schema";
import { redirect } from "next/navigation";
import {
  lookupTodoDocument,
  matchUserId,
  toStringMongoDBObjectId,
  unwindContent,
} from "./queries/queries";

export const setTodoStats = async (userid: string | undefined | null) => {
  if (!userid) {
    redirect("/login");
  }

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
    .collection<TodoStats>("stat")
    .findOne({ date: prevDateSharp });
  if (recordedTodoStats) return recordedTodoStats;

  const todosDoc = (await db
    .collection("todos")
    .aggregate([
      matchUserId(userid),
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
    .toArray()) as (LookupedTodoWithObjectId & WithStringifyId)[];

  const todoStats = todosDoc.map(todoDoc => ({
    todo: todoDoc.content,
    date: prevDateSharp,
  }));

  await db.collection("stat").insertMany(todoStats);
  return todoStats;
};

// 단일 투두 객체 검색 => stat 문서에 이미 해당 투두가 있으면 패스
// stat 문서에 해당 투두가 없다면 _id를 오늘 날짜로 설정하고 투두 등록

// 현재 날짜 11/22
// 11/17 ~ 11/25 가져와야 함
// 11/22 ~ 11/22 가져와야 함
// 11/19 ~ 11/21 가져오면 안됨
// 11/11 ~ null 가져와야 함
