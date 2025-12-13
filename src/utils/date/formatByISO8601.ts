// ISO8601 포맷 - yyyy-mm-dd

export const formatByISO8601 = (dateObject: Date | d3.NumberValue) => {
  if (typeof dateObject === "object") {
    const dayOfMonth = new Date(dateObject.toString()).getDate().toString();
    const padDate = dayOfMonth.padStart(2, "0");

    const dateISO8601Type = `${new Date(dateObject.toString()).getFullYear()}-${
      new Date(dateObject.toString()).getMonth() + 1
    }-${padDate}`;

    return dateISO8601Type;
  }
  return dateObject.toString();
};
