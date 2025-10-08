"use server";

import { connectDB } from "@/libs/database";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";

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

  const passwordRegex = new RegExp(/(?=.*[a-z])(?=.*\d).+/);
  const emailRegex = new RegExp(/^\w{3;}\@\w{3,}\.\w{2,3}$/);

  console.log(joinFormData.password);

  if (joinFormData.userid.length <= 5 || joinFormData.userid.length >= 21)
    return { message: "아이디는 6자 ~ 20자 이내로 입력해야 합니다." };
  if (!passwordRegex.test(joinFormData.password))
    return {
      message: "비밀번호는 숫자와 소문자가 적어도 1개 이상 포함되어야 합니다.",
    };
  if (joinFormData.password.length <= 7 || joinFormData.userid.length >= 25)
    return { message: "비밀번호는 8자 ~ 24자 이내로 입력해야 합니다." };
  if (joinFormData.password !== confirmPassword)
    return {
      message: "비밀번호 입력란과 비밀번호 확인란이 일치하지 않습니다.",
    };
  if (emailRegex.test(joinFormData.email))
    return { message: "이메일 형식을 올바르게 작성해주세요" };

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
  db.collection("users").insertOne(joinFormData);
  redirect("/login");
};
