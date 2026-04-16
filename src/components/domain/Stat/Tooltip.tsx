import { StateType } from "@/types/todos/schema";

interface TooltipProps {
  date: string;
  state: StateType;
  count: number;
}

export default function Tooltip({ date, state, count }: TooltipProps) {
  return (
    <>
      <span className="text-caption">{date}</span>
      <span className="">{state} 상태 : </span>
      <span className="text-regular">총 {count}개</span>
    </>
  );
}
