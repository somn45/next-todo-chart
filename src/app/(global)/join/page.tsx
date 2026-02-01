import Nav from "@/components/ui/molecules/Nav";
import JoinForm from "@/components/ui/organisms/JoinForm";
import { NavLinkItem } from "@/types/ui";

const loginNavLinks: NavLinkItem[] = [
  {
    href: "/login",
    content: "로그인 페이지로 가기",
  },
];

export default function JoinPage() {
  return (
    <>
      <JoinForm />
      <Nav NavLinks={loginNavLinks} />
    </>
  );
}
