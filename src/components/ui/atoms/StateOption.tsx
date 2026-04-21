import { MOBILE_MEDIAM_SIZE } from "@/constants/media";
import { StateType } from "@/types/todos/schema";
import { Check, Ellipsis, Notebook } from "lucide-react";
import { useEffect, useState } from "react";

interface StateOptionProps {
  stateType: StateType;
  isActive: boolean;
}

export default function StateOption({ stateType, isActive }: StateOptionProps) {
  const [windowSize, setWindowSize] = useState(0);

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

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    if (window.innerWidth !== 0) setWindowSize(window.innerWidth);

    window.addEventListener("resize", handleWindowResize);
  }, [windowSize]);

  const iconByState: { [key: string]: React.ReactNode } = {
    "할 일": <Notebook />,
    "진행 중": <Ellipsis />,
    완료: <Check />,
  };

  if (windowSize <= MOBILE_MEDIAM_SIZE) {
    return (
      <button
        type="submit"
        className={` ${stateOptionClassname} ${hoveredStateOptionColor[stateType]} cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold`}
      >
        {isActive ? stateType : iconByState[stateType]}
      </button>
    );
  }
  return (
    <button
      type="submit"
      className={` ${stateOptionClassname} ${hoveredStateOptionColor[stateType]} w-20 cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold`}
    >
      {stateType}
    </button>
  );
}
