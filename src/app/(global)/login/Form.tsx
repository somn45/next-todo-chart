"use client";

import Button from "@/components/ui/atoms/Button";
import Input from "@/components/ui/atoms/Input";
import { useActionState } from "react";

interface FormState {
  message: string;
}

interface FormProps {
  serverAction: (
    prevState: FormState,
    formData: FormData,
  ) => Promise<FormState>;
  initialState: FormState;
}

export default function Form({ serverAction, initialState }: FormProps) {
  const [state, formAction] = useActionState(serverAction, initialState);

  return (
    <form role="form" action={formAction}>
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
      <span data-testid="validate-message">{state.message}</span>
    </form>
  );
}
