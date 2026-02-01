import Nav from "@/components/ui/molecules/Nav";
import { NavLinkItem } from "@/types/ui";

const mainNavLinks: NavLinkItem[] = [
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
