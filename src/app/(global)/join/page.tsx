import { join } from "@/actions/join";
import Link from "next/link";

export default function JoinPage() {
  return (
    <>
      <form action={join}>
        <input type="text" placeholder="회원 아이디" name="userid" />
        <input type="password" placeholder="비밀번호" name="password" />
        <input
          type="password"
          placeholder="비밀번호 확인"
          name="confirm-password"
        />
        <input type="text" placeholder="이메일" name="email" />
        <button type="submit">회원가입</button>
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
