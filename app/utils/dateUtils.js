// src/utils/dateUtils.js
export const getStartDateOfWeek = (label) => {
  const match = label.match(/[A-Za-z]{3} (\d{2})-W(\d{1,2})/);
  if (!match) return label;

  const [_, yearSuffix, weekStr] = match;
  const year = parseInt(`20${yearSuffix}`, 10);
  const week = parseInt(weekStr, 10);

  // ISO 8601 weeks: Week 1 contains the first Thursday of the year
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }

  return ISOweekStart.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
