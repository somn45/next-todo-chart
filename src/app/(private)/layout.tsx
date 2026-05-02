import Header from "./Header";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main className="wrapper overflow-x-auto">
        <div></div>
        {children}
      </main>
    </>
  );
}
