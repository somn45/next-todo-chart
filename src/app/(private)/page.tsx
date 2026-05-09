import { Metadata } from "next";
import Image from "next/image";
import thumbnail from "../../../public/NextTodoChart_thumbnail.jpg";
import Nav from "@/components/ui/molecules/Nav";
import { NavLinkItem } from "@/types/ui";
import { StyleHTMLAttributes } from "react";

export const metadata: Metadata = {
  title: "홈",
  description:
    "여러분의 하루를 NextTodoChart와 함께해보세요. 대시보드로 접속해서 내가 작성한 할 일 목록과 투두 스파크라인 차트를 확인해보세요.",
};

const navLinkItem: NavLinkItem[] = [
  {
    href: "/dashboard",
    content: "대시보드 접속",
  },
];
export default async function Home() {
  return (
    <section className="flex h-[calc(100vh-80px)] w-full flex-col items-center justify-center gap-5 px-2.5 lg:h-125 lg:pt-30">
      <Image
        src={thumbnail}
        alt="대표 이미지"
        width={500}
        height={500}
        sizes="100vw"
      />
      <article className="flex flex-col justify-center gap-2 px-5 text-center text-lg font-semibold lg:text-xl">
        <p>여러분의 하루를 NextTodoChart와 함께해보세요.</p>
        <p className="hidden md:block">
          대시보드로 접속해서 할 일 목록과 스파크라인 차트를 확인해보세요.
        </p>
      </article>
      <Nav NavLinks={navLinkItem} variant="typography" />
    </section>
  );
}
