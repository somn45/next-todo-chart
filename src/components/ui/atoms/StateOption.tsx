import { StateType } from "@/types/todos/schema";

interface StateOptionProps {
  stateType: StateType;
  isActive: boolean;
}

export default function StateOption({ stateType, isActive }: StateOptionProps) {
  const StateOptionColor: { [key: string]: string } = {
    "할 일": "bg-[#3498DB]",
    "진행 중": "bg-[#FFA500]",
    완료: "bg-[#2ECC71]",
  };

  const stateOptionClassname = isActive
    ? `${StateOptionColor[stateType]} text-text-light`
    : "bg-bg-disabled text-text-disabled";

  const hoveredStateOptionColor: { [key: string]: string } = {
    "할 일": "hover:bg-[#3498DB]",
    "진행 중": "hover:bg-[#FFA500]",
    완료: "hover:bg-[#2ECC71]",
  };

  return (
    <button
      type="submit"
      className={`${stateOptionClassname} ${hoveredStateOptionColor[stateType]} w-20 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold`}
    >
      {stateType}
    </button>
  );
}
