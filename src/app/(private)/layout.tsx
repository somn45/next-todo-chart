import Link from "next/link";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header>
        <nav>
          <ul style={{ display: "flex", gap: "20px", listStyleType: "none" }}>
            <li>
              <Link href="/dashboard">메인으로</Link>
            </li>
            <li>
              <Link href="/todos">투두리스트</Link>
            </li>
            <li>
              <Link href="/stats?tl=week&da=week">통계</Link>
            </li>
            <li>
              <Link href="/login">로그인</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <div></div>
        {children}
      </main>
    </>
  );
}
