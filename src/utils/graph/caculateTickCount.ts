import { DataDomainBaseType } from "@/types/graph/schema";

// 틱의 갯수를 구하는 함수
export const caculateTickCount = (
  dateDomainBase: DataDomainBaseType | undefined = "week",
  stateTypeCount: number,
  dataLength: number,
) => {
  if (dateDomainBase === "month")
    return Math.floor(dataLength / 7 / stateTypeCount);
  if (dateDomainBase === "year")
    return Math.floor(dataLength / 30 / stateTypeCount);
  return dataLength / stateTypeCount;
};
