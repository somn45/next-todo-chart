"use client";

import { login } from "@/actions/login";
import Link from "next/link";
import Form from "./Form";

export default function LoginPage() {
  return (
    <>
      <Form serverAction={login} initialState={{ message: "" }} />
      <nav>
        <ul>
          <li>
            <Link href="/join">회원가입 페이지로 가기</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
