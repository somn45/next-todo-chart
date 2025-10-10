"use client";

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
    <form action={formAction} aria-label="회원가입 양식">
      <input
        type="text"
        placeholder="회원 아이디"
        name="userid"
        aria-label="userid"
      />
      <input
        type="password"
        placeholder="비밀번호"
        name="password"
        aria-label="password"
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        name="confirm-password"
        aria-label="confirm-password"
      />
      <input type="text" placeholder="이메일" name="email" aria-label="email" />
      <button type="submit">회원가입</button>
      <span data-testid="validate-message">{state.message}</span>
    </form>
  );
}
