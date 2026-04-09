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
      <body className="m-0 flex flex-col-reverse rounded-none">
        <section>{modal}</section>
        {children}
      </body>
    </html>
  );
}
