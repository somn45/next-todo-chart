export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="global-wrapper flex-col">{children}</section>;
}
