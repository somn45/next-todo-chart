"use client";

import { join } from "@/actions/join";
import Link from "next/link";
import { useActionState } from "react";

export default function JoinPage() {
  const [state, formAction] = useActionState(join, { message: "" });
  return (
    <>
      <form action={formAction}>
        <input type="text" placeholder="회원 아이디" name="userid" />
        <input type="password" placeholder="비밀번호" name="password" />
        <input
          type="password"
          placeholder="비밀번호 확인"
          name="confirm-password"
        />
        <input type="text" placeholder="이메일" name="email" />
        <button type="submit">회원가입</button>
        <span>{state.message}</span>
      </form>
      <nav>
        <ul>
          <li>
            <Link href="/login">로그인 페이지로 가기</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
