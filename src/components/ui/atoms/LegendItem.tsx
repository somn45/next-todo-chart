interface LegendItemProps {
  text: string;
  categoryType: "rect" | "circle";
}

export default function LegendItem({ text, categoryType }: LegendItemProps) {
  const StateOptionColor: { [key: string]: string } = {
    총합: "bg-[#000000]",
    "할 일": "bg-[#3498DB]",
    "진행 중": "bg-[#FFA500]",
    완료: "bg-[#2ECC71]",
  };

  if (categoryType === "rect")
    return (
      <li key={text} className="flex items-center gap-2">
        <div
          data-testid="legend category"
          className={`h-0.5 w-3.75 ${StateOptionColor[text]}`}
        ></div>
        <span data-testid="legend text" className="text-sm">
          {text}
        </span>
      </li>
    );
  return (
    <li key={text} className="flex items-center gap-2">
      <div
        data-testid="legend category"
        className={`size-2.5 rounded-full ${StateOptionColor[text]}`}
      ></div>
      <span data-testid="legend text" className="text-sm">
        {text}
      </span>
    </li>
  );
}
