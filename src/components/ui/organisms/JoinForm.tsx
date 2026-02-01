"use client";

import { useActionState } from "react";
import Button from "../atoms/Button";
import ErrorMessage from "../atoms/ErrorMessage";
import Input from "../atoms/Input";
import { join } from "@/actions/join";

export default function JoinForm() {
  const [state, formAction] = useActionState(join, { message: "" });
  return (
    <form role="form" action={formAction} aria-label="회원가입 양식">
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
      <Input
        type="password"
        placeholder="비밀번호 확인"
        name="confirm-password"
        ariaLabel="비밀번호 확인 입력칸"
      />
      <Input
        type="email"
        placeholder="이메일"
        name="email"
        ariaLabel="이메일 입력칸"
      />
      <Button type="submit" value="회원가입" />
      <ErrorMessage message={state.message} dataTestId="validate-message" />
    </form>
  );
}
