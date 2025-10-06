import { connectDB } from "@/libs/database";

export const getMockData = async () => {
  const db = (await connectDB).db("next-todo-chart-cluster");
  const mockData = await db.collection("mock").find().toArray();
  return mockData;
};
