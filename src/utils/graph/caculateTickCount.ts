// 틱의 갯수를 구하는 함수
export const caculateTickCount = (
  dateDomainBase: "week" | "month" | "year" | undefined = "week",
  count: number,
  dataLength: number,
) => {
  if (dateDomainBase === "month") return Math.floor(dataLength / 7 / count);
  if (dateDomainBase === "year") return Math.floor(dataLength / 30 / count);
  return dataLength / count;
};
