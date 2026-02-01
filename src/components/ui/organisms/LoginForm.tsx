"use client";

import { useActionState } from "react";
import Button from "../atoms/Button";
import ErrorMessage from "../atoms/ErrorMessage";
import Input from "../atoms/Input";
import { login } from "@/actions/login";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, { message: "" });
  return (
    <form role="form" action={formAction} aria-label="로그인 양식">
      <Input
        type="text"
        placeholder="회원 아이디"
        name="userid"
        ariaLabel="아이디 입력칸"
      />
      <Input
        type="password"
        placeholder="비밀번호"
        name="password"
        ariaLabel="비밀번호 입력칸"
      />
      <Button type="submit" value="로그인" />
      <ErrorMessage message={state.message} dataTestId="validate-message" />
    </form>
  );
}
