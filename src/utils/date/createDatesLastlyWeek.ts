import { getCurrentDateSharp } from "./getDateInCurrentDate";

const ONE_DAY = 1000 * 60 * 60 * 24;

/**
 * 최근 1주에 해당하는 날짜 배열 생성
 * 예: 오늘이 12/10이라면
 * 12/3 ~ 12/9 날짜가 포함된 배열을 return
 */
export const createDatesLastlyWeek = () => {
  const weeks = Array.from({ length: 7 }, (_, i) => i - 1);
  const currentDateSharp = getCurrentDateSharp();

  const dateListLastlyWeek = weeks.map(
    day =>
      new Date(currentDateSharp.getTime() - (weeks.length - 1 - day) * ONE_DAY),
  );
  return dateListLastlyWeek;
};
