// 금주에 해당하는 날짜 배열 생성
export const createDatesOfCurrentWeek = () => {
  const currentDay = new Date().getDay();
  const currentWeekArray = Array.from({ length: 7 }, (_, i) => i - currentDay);
  const currentWeek = currentWeekArray.map(ele => {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    return new Date(Date.now() + ONE_DAY * ele);
  });
  return currentWeek;
};

// 금월에 해당하는 날짜 배열 생성
export const createDatesOfCurrentMonth = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const countDateOfMonth = new Date(currentYear + 1, currentMonth, 0).getDate();
  const currentMonthArray = Array.from(
    { length: countDateOfMonth },
    (_, i) => i + 1,
  );
  const currentMonthDates = currentMonthArray.map(
    date => new Date(currentYear, currentMonth, date),
  );
  return currentMonthDates;
};

// 금년에 해당하는 날짜 배열 생성
export const createDatesOfCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  const countDateOfYear =
    (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
    currentYear % 400 === 0
      ? 366
      : 365;
  const currentYearDates = Array.from(
    { length: countDateOfYear },
    (_, i) => new Date(currentYear, 0, i + 1),
  );
  return currentYearDates;
};
