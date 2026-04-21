import LegendItem from "../atoms/LegendItem";

interface LegendListProps {
  categoryType: "rect" | "circle";
  legendTexts: string[];
}

export default function LegendList({
  legendTexts,
  categoryType,
}: LegendListProps) {
  return (
    <ul className="flex gap-4 md:hidden">
      {legendTexts.map(legendText => (
        <LegendItem
          key={legendText}
          text={legendText}
          categoryType={categoryType}
        />
      ))}
    </ul>
  );
}
