"use client";

import Form from "./Form";
import { join } from "@/actions/join";
import Nav from "@/components/ui/molecures/Nav";
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
      <Form serverAction={join} initialState={{ message: "" }} />
      <Nav NavLinks={loginNavLinks} />
    </>
  );
}
