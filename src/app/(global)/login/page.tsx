import type { Metadata } from "next";
import Nav from "@/components/ui/molecules/Nav";
import { NavLinkItem } from "@/types/ui";
import LoginForm from "@/components/ui/organisms/LoginForm";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "NextTodoChart에 로그인하고 대시보드에서 나의 할 일 목록과 현황 차트를 확인해보세요.",
};

const loginNavLinks: NavLinkItem[] = [
  {
    href: "/join",
    content: "회원가입 페이지로 가기",
  },
];

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <Nav NavLinks={loginNavLinks} />
    </>
  );
}
