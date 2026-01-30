import Navigation from "./Navigation";

export default function DailyActiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
