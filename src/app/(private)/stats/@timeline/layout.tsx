import TabMenu from "./StatsTabMenu";

export default function TimeLineLayout({
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
