import { connectDB } from "@/libs/database";
import {
  LookupedTodo,
  Stat,
  StatStringifyId,
  WithStringifyId,
} from "@/types/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

interface IIntegratedTodos {
  activeTodos: (LookupedTodo & WithStringifyId)[];
  todosIncludeThisWeek: (LookupedTodo & WithStringifyId)[];
  todoStats: StatStringifyId[];
}

export const getIntegratedTodos = async (
  userid: string | undefined | null,
  searchRange: "week" | "month" | "year" = "week",
) => {
  "use cache";
  cacheTag("dashboard");

  if (!userid) {
    redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const gracePeriod = new Date(Date.now());
  const startOfPeriod = getStartOfPeriod(searchRange);
  const endOfPeriod = getEndOfPeriod(searchRange);

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
                  { "content.createdAt": { $lte: endOfPeriod } },
                  {
                    $or: [
                      { "content.completedAt": { $gte: startOfPeriod } },
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

  const dateListLastlyPeriod = getDatesLastlyPeriod(searchRange);

  const statsDoc = (await db
    .collection("stat")
    .aggregate([
      {
        $match: { date: { $in: dateListLastlyPeriod } },
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

  const dashboardDataList = {
    ...integratedTodos,
    todoStats: statsDoc,
  };

  return JSON.parse(JSON.stringify(dashboardDataList)) as IIntegratedTodos;
};
