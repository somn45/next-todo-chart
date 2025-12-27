// 금주에 해당하는 날짜 배열 생성
const createDatesOfCurrentWeek = () => {
  const currentDay = new Date().getDay();
  const currentWeekArray = Array.from({ length: 7 }, (_, i) => i - currentDay);
  const currentWeek = currentWeekArray.map(ele => {
    const ONE_DAY = 1000 * 60 * 60 * 24;
    return new Date(Date.now() + ONE_DAY * ele);
  });
  return currentWeek;
};

export default createDatesOfCurrentWeek;
