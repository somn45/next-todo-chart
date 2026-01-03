import { getCurrentDateSharp } from "./getDateInCurrentDate";

const ONE_DAY = 1000 * 60 * 60 * 24;

export const getDatesLastlyPeriod = (periodType: "week" | "month" | "year") => {
  if (periodType === "year") return createDatesLastlyYear();
  if (periodType === "month") return createDatesLastlyMonth();
  return createDatesLastlyWeek();
};

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

export const createDatesLastlyMonth = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const countDateOfMonth = new Date(currentYear, currentMonth, 0).getDate();

  const month = Array.from(
    { length: countDateOfMonth },
    (_, i) => i - countDateOfMonth,
  );
  const dateListLastlyMonth = month.map(
    day => new Date(currentYear, currentMonth, currentDate + day),
  );
  return dateListLastlyMonth;
};

export const createDatesLastlyYear = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const countDateOfYear =
    (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
    currentYear % 400 === 0
      ? 366
      : 365;

  const year = Array.from(
    { length: countDateOfYear },
    (_, i) => i - countDateOfYear,
  );
  const dateListlastlyYear = year.map(
    day => new Date(currentYear, currentMonth, currentDate + day),
  );
  return dateListlastlyYear;
};
