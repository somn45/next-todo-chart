import { login } from "@/actions/login";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <form action={login}>
        <input type="text" placeholder="회원 아이디" name="userid" />
        <input type="password" placeholder="비밀번호" name="password" />
        <button type="submit">로그인</button>
      </form>
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
