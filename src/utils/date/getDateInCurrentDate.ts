import createDatesOfCurrentWeek from "./createDatesOfCurrentWeek";

// 현재 날짜의 정각 시각 가져오기
export const getCurrentDateSharp = () =>
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );

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
