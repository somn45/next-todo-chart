import { connectDB } from "@/libs/database";
import {
  LookupedTodo,
  Stat,
  StatStringifyId,
  WithStringifyId,
} from "@/types/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import {
  getCurrentWeekEndDate,
  getCurrentWeekStartDate,
} from "@/utils/date/getDateInCurrentDate";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

interface IIntegratedTodos {
  activeTodos: (LookupedTodo & WithStringifyId)[];
  todosIncludeThisWeek: (LookupedTodo & WithStringifyId)[];
  todoStats: StatStringifyId[];
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

  const dateListLastlyWeek = getDatesLastlyPeriod("week");
  const dateListLastlyMonth = getDatesLastlyPeriod("month");
  const dateListLastlyYear = getDatesLastlyPeriod("year");

  const statsDoc = (await db
    .collection("stat")
    .aggregate([
      {
        $match: { date: { $in: dateListLastlyWeek } },
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
      { $sort: { _id: 1 } },
    ])
    .toArray()) as Stat[];

  const statsMap = new Map(statsDoc.map(d => [d._id.getTime(), d]));
  const stats = dateListLastlyWeek.map(
    date =>
      statsMap.get(date.getTime()) || {
        _id: date,
        totalCount: 0,
        todoStateCount: 0,
        doingStateCount: 0,
        doneStateCount: 0,
      },
  );

  const dashboardDataList = {
    ...integratedTodos,
    todoStats: stats,
  };

  return JSON.parse(JSON.stringify(dashboardDataList)) as IIntegratedTodos;
};
