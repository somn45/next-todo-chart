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
    <form role="form" action={formAction}>
      <input
        type="text"
        placeholder="회원 아이디"
        name="userid"
        aria-label="아이디"
      />
      <input
        type="password"
        placeholder="비밀번호"
        name="password"
        aria-label="비밀번호"
      />
      <button type="submit">로그인</button>
      <span data-testid="validate-message">{state.message}</span>
    </form>
  );
}
