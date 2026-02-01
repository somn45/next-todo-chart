import Nav from "@/components/ui/molecules/Nav";
import { NavLinkItem } from "@/types/ui";
import LoginForm from "@/components/ui/organisms/LoginForm";

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
