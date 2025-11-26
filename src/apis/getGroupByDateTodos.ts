import { connectDB } from "@/libs/database";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { redirect } from "next/navigation";

export const getGroupByDateTodos = async (
  userid: string | undefined | null,
) => {
  "use cache";
  cacheTag("todos");

  if (!userid) {
    redirect("/login");
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  // 라인 차트에 그릴 데이터 가져오는 기준
  // 11/7일이라면 createdAt ~ completedAt 사이일 때
  // createdAt: 11/1, completedAt: 11/12

  const todosDoc = await db
    .collection("todo")
    .aggregate([
      {
        $match: {
          userid,
          $expr: {
            $and: [
              {
                $lte: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                  { $dateToString: { format: "%Y-%m-%d", date: new Date() } },
                ],
              },
              {
                $or: [
                  {
                    $gt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: "$completedAt",
                        },
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: new Date(),
                        },
                      },
                    ],
                  },
                  { $not: "$completedAt" },
                ],
              },
            ],
          },
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(todosDoc));
};
