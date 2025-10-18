"use server";

import { connectDB } from "@/libs/database";
import { validateUser } from "@/utils/validateUser";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { setCookies } from "@/utils/setCookies";

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
  if (!loggedUser || !isMatchPassword) {
    return { message: "아이디 또는 비밀번호가 일치하지 않습니다." };
  }

  // 추후 시크릿 키가 없을 때 에러 던지기 추가
  const { accessToken, refreshToken } = await (
    await fetch("http://localhost:3000/api/token", {
      method: "POST",
      body: JSON.stringify(loggedUser.userid),
    })
  ).json();
  await setCookies(accessToken, 1000 * 60 * 60);
  db.collection("users").findOneAndUpdate(
    { userid: loggedUser.userid },
    {
      $set: {
        refreshToken,
      },
    },
  );
  redirect("/");
};
