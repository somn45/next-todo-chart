"use server";

import { connectDB } from "@/libs/database";
import { validateUser } from "@/utils/validateUser";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

interface LoginFormData {
  userid: string;
  password: string;
}

interface User {
  userid: string;
  password: string;
}

export const login = async (
  prevState: { message: string },
  formdata: FormData,
): Promise<{ message: string }> => {
  const loginFormData = {
    userid: formdata.get("userid"),
    password: formdata.get("password"),
  } as LoginFormData;
  const validateErrorMessage = validateUser(loginFormData);
  if (validateErrorMessage) {
    return { message: validateErrorMessage };
  }

  const db = (await connectDB).db("next-todo-chart-cluster");

  const loggedUser = await db
    .collection<User>("users")
    .findOne({ userid: loginFormData.userid });
  const isMatchPassword = await bcrypt.compare(
    loginFormData.password,
    loggedUser?.password || "",
  );
  console.log(isMatchPassword);
  if (!loggedUser || !isMatchPassword) {
    return { message: "아이디 또는 비밀번호가 일치하지 않습니다." };
  }
  redirect("/");
};
