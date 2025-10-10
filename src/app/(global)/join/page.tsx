"use client";

import Link from "next/link";
import Form from "./Form";
import { join } from "@/actions/join";

export default function JoinPage() {
  return (
    <>
      <Form serverAction={join} initialState={{ message: "" }} />
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
