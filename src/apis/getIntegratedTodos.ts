import { connectDB } from "@/libs/database";
import { DataDomainBaseType } from "@/types/graph/schema";
import { TodoStat } from "@/types/stats/schema";
import { RawTodo, SerializedTodo, TodosType } from "@/types/todos/schema";
import { getDatesLastlyPeriod } from "@/utils/date/createDatesLastlyWeek";
import {
  getEndOfPeriod,
  getStartOfPeriod,
} from "@/utils/date/getDateInCurrentDate";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

interface IIntegratedTodos {
  activeTodos: Array<TodosType & SerializedTodo>;
  todosIncludeThisWeek: Array<TodosType & SerializedTodo>;
  todoStats: TodoStat[];
}

export const getIntegratedTodos = async (
  userid: string | undefined | null,
  searchRange: DataDomainBaseType = "week",
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

  const integratedTodos = (await db
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
    .next()) as {
    activeTodos: Array<TodosType & RawTodo>;
    todosIncludeThisWeek: Array<TodosType & RawTodo>;
  };

  const dateListLastlyPeriod = getDatesLastlyPeriod(searchRange);

  const statsDoc = (await db
    .collection("stats")
    .aggregate([
      {
        $match: { date: { $in: dateListLastlyPeriod } },
      },
      { $project: { _id: 0 } },
    ])
    .toArray()) as TodoStat[];

  const dashboardDataList = {
    ...JSON.parse(JSON.stringify(integratedTodos)),
    todoStats: statsDoc,
  };

  return dashboardDataList as IIntegratedTodos;
};
