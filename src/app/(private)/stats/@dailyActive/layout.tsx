import TabMenu from "./TabMenu";

export default function DailyActiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <TabMenu />
      {children}
    </div>
  );
}
