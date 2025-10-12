"use server";

import { connectDB } from "@/libs/database";
import { validateUser } from "@/utils/validateUser";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

interface JoinFormData {
  userid: string;
  password: string;
  email: string;
}

interface User {
  _id: ObjectId;
  userid: string;
}

export const join = async (
  prevState: { message: string },
  formData: FormData,
) => {
  const joinFormData = {
    userid: formData.get("userid"),
    password: formData.get("password"),
    email: formData.get("email"),
  } as JoinFormData;
  const confirmPassword = formData.get("confirm-password") as string;

  const validateErrorMessage = validateUser({
    ...joinFormData,
    confirmPassword,
  });

  if (validateErrorMessage) return { message: validateErrorMessage };

  const hashedPassword = await bcrypt.hash(joinFormData.password, 5);

  const db = (await connectDB).db("next-todo-chart-cluster");
  const users = await db.collection("users").find().toArray();
  if (Array.isArray(users) && users.length === 0) {
    db.createCollection("users");
  }

  const user = await db
    .collection<User>("users")
    .findOne({ userid: joinFormData.userid });
  if (user?.userid === joinFormData.userid)
    return { message: "현재 입력하신 아이디는 이미 가입되었습니다." };

  db.collection("users").insertOne({
    ...joinFormData,
    password: hashedPassword,
  });
  redirect("/login");
};
