import { connectDB } from "@/libs/database";
import { LookupedTodo, WithStringifyId } from "@/types/schema";
import {
  getCurrentWeekEndDate,
  getCurrentWeekStartDate,
} from "@/utils/date/getDateInCurrentDate";
import { redirect } from "next/navigation";

export const getAllTodos = async (userid: string | undefined | null) => {
  if (!userid) {
    return redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  // 시작일과 종료일이 이번주 일자 안에 포함되어야 하나?
  // 예시 : 12/05일 금요일자의 이번 주 타임라인(11/30(일) ~ 12/06)
  // 12/01 ~ 12/06 => 포함
  // 11/27 ~ 12/01 => 포함
  // 12/07 ~ 12/09 => 포함
  // 11/23 ~ 12/18 => 포함
  // 12/10 ~ 12/15 => 미포함
  // 11/27 ~ 11/29 => 미포함
  // 조건
  // createdAt <= 금주 일요일
  // completedAt >= 금주 월요일

  const currentWeekStartDate = getCurrentWeekStartDate();
  const currentWeekEndDate = getCurrentWeekEndDate();

  const todosDoc = await db
    .collection("todos")
    .aggregate([
      {
        $match: {
          author: userid,
        },
      },
      {
        $lookup: {
          from: "todo",
          localField: "content",
          foreignField: "_id",
          as: "content",
        },
      },
      {
        $unwind: {
          path: "$content",
        },
      },
      {
        $match: {
          $and: [
            { "content.createdAt": { $lte: currentWeekEndDate } },
            {
              $or: [
                { "content.completedAt": { $gte: currentWeekStartDate } },
                { "content.completedAt": null },
              ],
            },
          ],
        },
      },
      {
        $set: {
          _id: { $toString: "$_id" },
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(todosDoc)) as (LookupedTodo &
    WithStringifyId)[];
};
