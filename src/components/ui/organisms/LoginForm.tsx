"use client";

import { RefObject, useActionState, useEffect, useRef } from "react";
import Button from "../atoms/Button";
import ErrorMessage from "../atoms/ErrorMessage";
import Input from "../atoms/Input";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";

type LoginRouteStateType = "origin" | "intercepter";

export default function LoginForm({
  routeState = { current: "origin" },
}: {
  routeState: RefObject<LoginRouteStateType>;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(login, { message: "" });

  useEffect(() => {
    if (state.message === "로그인이 완료되었습니다.") {
      if (routeState.current === "intercepter") router.back();

      router.push("/");
      router.refresh();
    }
  }, [state]);

  return (
    <form
      role="form"
      action={formAction}
      aria-label="로그인 양식"
      className="container items-center"
    >
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
      <ErrorMessage message={state.message} dataTestId="validate-message" />
      <Button type="submit" variant="submit" value="로그인" />
    </form>
  );
}
