import JoinForm from "@/components/ui/organisms/JoinForm";

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
