import JoinForm from "@/components/ui/organisms/JoinForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description:
    "지금 NextTodoChart에 가입하여 나의 할 일을 작성해보세요. D3.js로 구현한 차트를 통해 투두 작성 현황과 타임라인을 확인해 볼 수 있습니다.",
};

export default function JoinPage() {
  return (
    <>
      <JoinForm />
      <a
        href="/login"
        className="text-1st-light text-base font-semibold hover:underline"
      >
        로그인 페이지로 가기
      </a>
    </>
  );
}
