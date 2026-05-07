import "@/app/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | NextTodoChart",
    default: "NextTodoChart",
  },
  description:
    "D3.js를 사용하여 투두리스트를 계획하고 차트로 현황을 추적합니다.",
  icons: {
    icon: "./NextTodoChart_favicon.png",
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/NextTodoChart_favicon.ico" sizes="any" />
      <body className="border-b-1st-dark m-0 flex flex-col-reverse rounded-none md:flex-col">
        <section>{modal}</section>
        {children}
      </body>
    </html>
  );
}
