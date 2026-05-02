import "@/app/global.css";

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="border-b-1st-dark m-0 flex flex-col-reverse rounded-none md:flex-col">
        <section>{modal}</section>
        {children}
      </body>
    </html>
  );
}
