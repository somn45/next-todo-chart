"use server";

import { connectDB } from "@/libs/database";
import { redirect } from "next/navigation";

interface JoinFormData {
  userid: string;
  password: string;
  email: string;
}

export const join = async (formData: FormData) => {
  const joinFormData = {
    userid: formData.get("userid"),
    password: formData.get("password"),
    email: formData.get("email"),
  } as JoinFormData;
  const confirmPassword = formData.get("confirm-password") as string;

  const db = (await connectDB).db("next-todo-chart-cluster");
  const users = await db.collection("users").find().toArray();
  if (Array.isArray(users) && users.length === 0) {
    db.createCollection("users");
  }
  db.collection("users").insertOne(joinFormData);
  redirect("/login");
};
