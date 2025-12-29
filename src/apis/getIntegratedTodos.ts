import { connectDB } from "@/libs/database";
import { LookupedTodo, Stat, TodoStats, WithStringifyId } from "@/types/schema";
import { createDatesLastlyWeek } from "@/utils/date/createDatesLastlyWeek";
import {
  getCurrentWeekEndDate,
  getCurrentWeekStartDate,
} from "@/utils/date/getDateInCurrentDate";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

interface IIntegratedTodos {
  activeTodos: (LookupedTodo & WithStringifyId)[];
  todosIncludeThisWeek: (LookupedTodo & WithStringifyId)[];
  todoStats: Stat[];
}

export const getIntegratedTodos = async (userid: string | undefined | null) => {
  "use cache";
  cacheTag("dashboard");

  if (!userid) {
    redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const gracePeriod = new Date(Date.now());
  const currentWeekStartDate = getCurrentWeekStartDate();
  const currentWeekEndDate = getCurrentWeekEndDate();

  const integratedTodos = await db
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
        $facet: {
          activeTodos: [
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
                      { "content.completedAt": { $gte: gracePeriod } },
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
          ],
          todosIncludeThisWeek: [
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
          ],
        },
      },
    ])
    .next();

  const dateListLastlyWeek = createDatesLastlyWeek();

  const todoStatsDoc = await Promise.all(
    dateListLastlyWeek.map(async dateInLastWeek => {
      const todoStatsDoc = (await db
        .collection<Stat>("stat")
        .aggregate([
          {
            $match: { date: dateInLastWeek },
          },
          {
            $group: {
              _id: "$date",
              totalCount: {
                $sum: 1,
              },
              todoStateCount: {
                $sum: {
                  $cond: [{ $eq: ["$todo.state", "할 일"] }, 1, 0],
                },
              },
              doingStateCount: {
                $sum: {
                  $cond: [{ $eq: ["$todo.state", "진행 중"] }, 1, 0],
                },
              },
              doneStateCount: {
                $sum: {
                  $cond: [{ $eq: ["$todo.state", "완료"] }, 1, 0],
                },
              },
            },
          },
        ])
        .next()) as Stat;

      return todoStatsDoc
        ? todoStatsDoc
        : {
            _id: dateInLastWeek,
            totalCount: 0,
            todoStateCount: 0,
            doingStateCount: 0,
            doneStateCount: 0,
          };
    }),
  );

  const dashboardDataList = {
    ...integratedTodos,
    todoStats: todoStatsDoc,
  };

  return JSON.parse(JSON.stringify(dashboardDataList)) as IIntegratedTodos;
};
