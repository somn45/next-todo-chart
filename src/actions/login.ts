"use server";

import { connectDB } from "@/libs/database";

interface LoginFormData {
  userid: string;
  password: string;
}

export const login = async (formdata: FormData) => {
  const loginFormData = {
    userid: formdata.get("userid"),
    password: formdata.get("password"),
  } as LoginFormData;
  const db = (await connectDB).db("next-todo-chart-cluster");
  const loggedUser = await db
    .collection("users")
    .findOne({ userid: loginFormData.userid });
  console.log(loggedUser);
};
