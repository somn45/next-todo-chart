import {
  createDatesOfCurrentMonth,
  createDatesOfCurrentWeek,
  createDatesOfCurrentYear,
} from "./createDatesOfCurrentWeek";

// 현재 날짜의 정각 시각 가져오기
export const getCurrentDateSharp = () =>
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );

export const getStartOfPeriod = (periodType: "week" | "month" | "year") => {
  if (periodType === "year") {
    return getCurrentYearStartDate();
  }
  if (periodType === "month") {
    const currentMonthStartDate = getCurrentMonthStartDate();
    return currentMonthStartDate;
  }
  const currentWeekStartDate = getCurrentWeekStartDate();
  return currentWeekStartDate;
};

export const getEndOfPeriod = (periodType: "week" | "month" | "year") => {
  if (periodType === "year") {
    return getCurrentYearEndDate();
  }
  if (periodType === "month") {
    const currentMonthStartDate = getCurrentMonthEndDate();
    return currentMonthStartDate;
  }
  const currentWeekStartDate = getCurrentWeekEndDate();
  return currentWeekStartDate;
};

// 금년의 시작일 00:00 가져오기
export const getCurrentYearStartDate = () => {
  const currentYear = createDatesOfCurrentYear();

  const currentYearStartDate = new Date(
    currentYear[0].getFullYear(),
    currentYear[0].getMonth(),
    currentYear[0].getDate(),
    0,
    0,
  );
  return currentYearStartDate;
};

// 금년의 종료일 23:59 가져오기
export const getCurrentYearEndDate = () => {
  const currentYear = createDatesOfCurrentYear();

  const currentYearEndDate = new Date(
    currentYear[currentYear.length - 1].getFullYear(),
    currentYear[currentYear.length - 1].getMonth(),
    currentYear[currentYear.length - 1].getDate(),
    0,
    0,
  );

  return currentYearEndDate;
};

// 금월의 시작일 00:00 가져오기
export const getCurrentMonthStartDate = () => {
  const currentMonth = createDatesOfCurrentMonth();

  const currentMonthStartDate = new Date(
    currentMonth[0].getFullYear(),
    currentMonth[0].getMonth(),
    1,
    0,
    0,
  );

  return currentMonthStartDate;
};

// 금월의 종료일 23:59 가져오기
export const getCurrentMonthEndDate = () => {
  const currentMonth = createDatesOfCurrentMonth();

  const currentMonthEndDate = new Date(
    currentMonth[currentMonth.length - 1].getFullYear(),
    currentMonth[currentMonth.length - 1].getMonth(),
    currentMonth[currentMonth.length - 1].getDate(),
    0,
    0,
  );

  return currentMonthEndDate;
};

// 금주의 시작일 00:00 가져오기
export const getCurrentWeekStartDate = () => {
  const currentWeek = createDatesOfCurrentWeek();

  const currentWeekStartDate = new Date(
    currentWeek[0].getFullYear(),
    currentWeek[0].getMonth(),
    currentWeek[0].getDate(),
    0,
    0,
  );
  return currentWeekStartDate;
};

// 금주의 종료일 23:59 가져오기
export const getCurrentWeekEndDate = () => {
  const currentWeek = createDatesOfCurrentWeek();

  const currentWeekEndDate = new Date(
    currentWeek[currentWeek.length - 1].getFullYear(),
    currentWeek[currentWeek.length - 1].getMonth(),
    currentWeek[currentWeek.length - 1].getDate(),
    23,
    59,
  );
  return currentWeekEndDate;
};
