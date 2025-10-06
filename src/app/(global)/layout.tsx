import Link from "next/link";

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
