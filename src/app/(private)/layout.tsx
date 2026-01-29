import Nav, { NavLinkAttr } from "@/components/ui/molecures/Nav";
import Link from "next/link";

const mainNavLinks: NavLinkAttr[] = [
  {
    href: "/dashboard",
    content: "메인으로",
  },
  {
    href: "/todos",
    content: "투두리스트",
  },
  {
    href: "/stats?tl=week&da=week",
    content: "통계",
  },
  {
    href: "/login",
    content: "로그인",
  },
];

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header>
        <Nav NavLinks={mainNavLinks} />
      </header>
      <main>
        <div></div>
        {children}
      </main>
    </>
  );
}
