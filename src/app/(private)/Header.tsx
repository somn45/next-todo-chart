"use client";

import Nav from "@/components/ui/molecules/Nav";
import { MAX_MOBILE_SIZE, MOBILE_LARGE_SIZE } from "@/constants/media";
import { NavLinkItem } from "@/types/ui";
import { ChartNoAxesCombined, House, ListTodo, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

const mainNavLinks: NavLinkItem[] = [
  {
    href: "/dashboard",
    content: "메인으로",
    icon: <House />,
  },
  {
    href: "/todos",
    content: "투두리스트",
    icon: <ListTodo />,
  },
  {
    href: "/stats?tl=week&da=week",
    content: "통계",
    icon: <ChartNoAxesCombined />,
  },
  {
    href: "/login",
    content: "로그아웃",
    icon: <LogOut />,
  },
];

export default function Header() {
  const [windowSize, setWindowSize] = useState(0);

  const mainNavLinks: NavLinkItem[] = [
    {
      href: "/dashboard",
      content: windowSize <= MAX_MOBILE_SIZE ? <House /> : "메인으로",
    },
    {
      href: "/todos",
      content: windowSize <= MAX_MOBILE_SIZE ? <ListTodo /> : "투두리스트",
    },
    {
      href: "/stats?tl=week&da=week",
      content: windowSize <= MAX_MOBILE_SIZE ? <ChartNoAxesCombined /> : "통계",
    },
    {
      href: "/login",
      content: windowSize <= MAX_MOBILE_SIZE ? <LogOut /> : "로그아웃",
    },
  ];

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (window.innerWidth !== 0) setWindowSize(window.innerWidth);

    window.addEventListener("resize", handleWindowResize);
  }, [windowSize]);

  return (
    <header className="md:border-b-surface-light bg-bg-light fixed bottom-0 z-50 flex h-20 w-full md:top-0 md:border-b-2">
      <Nav NavLinks={mainNavLinks} variant="header" />
    </header>
  );
}
