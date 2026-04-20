import { MONTH_INTERVAL, WEEK_INTERVAL } from "@/constants/graph";
import { DataDomainBaseType } from "@/types/graph/schema";

// 틱의 갯수를 구하는 함수
export const caculateTickCount = (
  dateDomainBase: DataDomainBaseType | undefined = "week",
  stateTypeCount: number,
  dataLength: number,
) => {
  if (dateDomainBase === "month")
    return Math.floor(dataLength / WEEK_INTERVAL / stateTypeCount);
  if (dateDomainBase === "year")
    return Math.floor(dataLength / MONTH_INTERVAL / stateTypeCount);
  return dataLength / stateTypeCount;
};
