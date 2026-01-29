"use client";

import Form from "./Form";
import { join } from "@/actions/join";
import Nav, { NavLinkAttr } from "@/components/ui/molecures/Nav";

const loginNavLinks: NavLinkAttr[] = [
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
