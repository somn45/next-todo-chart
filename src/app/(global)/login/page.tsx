"use client";

import { login } from "@/actions/login";
import Form from "./Form";
import Nav from "@/components/ui/molecures/Nav";
import { NavLinkItem } from "@/types/ui";

const loginNavLinks: NavLinkItem[] = [
  {
    href: "/join",
    content: "회원가입 페이지로 가기",
  },
];

export default function LoginPage() {
  return (
    <>
      <Form serverAction={login} initialState={{ message: "" }} />
      <Nav NavLinks={loginNavLinks} />
    </>
  );
}
