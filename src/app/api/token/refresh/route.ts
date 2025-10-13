import { connectDB } from "@/libs/database";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const db = (await connectDB).db("next-todo-chart-cluster");
  const refreshToken = db.collection("users").findOne({});
}
