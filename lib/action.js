export async function fetchAllLines(statType, transportType, vetted) {
  if (statType === 'call_for_service') {
    statType = 'calls_for_service';
  }

  let url = `${process.env.NEXT_PUBLIC_APP_HOST}routes/?stat_type=${statType}`;

  if (transportType !== 'systemwide') {
    url += `&transport_type=${transportType}`;
  }

  if (statType === 'crime') {
    url += `&vetted=${vetted}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data!');
    }

    const data = await response.json();
    return data.sort();
  } catch (error) {
    return error.message;
  }
}

export async function fetchTimeRange(statType, transportType, published, vetted) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let thisMonth = [];
  let previousMonth = [];
  let lastQuarter = [];
  let url = `${process.env.NEXT_PUBLIC_APP_HOST}${statType}/date_details?&published=${published}`;

  if (transportType !== 'systemwide') {
    url += `&transport_type=${transportType}`;
  }

  if (statType === 'crime') {
    url += `&vetted=${vetted}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data!');
    }

    const data = await response.json();

    if (data.length) {
      const datesObj = {};
      thisMonth = data.slice(0, 1);
      previousMonth = data.slice(0, 2);
      lastQuarter = data.slice(0, 3);

      data.forEach((date) => {
        const [year, month] = date.split('-');

        if (!datesObj[year]) {
          datesObj[year] = [];
        }

        if (datesObj[year].indexOf(month) === -1) {
          datesObj[year].push(monthNames[month - 1]);
        }
      });
      const dates = [];
      
      for (const [year, months] of Object.entries(datesObj)) {
        dates.push({
          year,
          months: months.reverse()
        });
      }
      
      dates.reverse();
      dates.forEach((dateObj) => {
        dateObj.selectedMonths = [];

        lastQuarter.forEach((date) => {
          const [year] = date.split('-');

          if (dateObj.year === year) {
            dateObj.selectedMonths.push(date);
          }
        });
      });
      return { dates: dates, thisMonth: thisMonth, previousMonth: previousMonth, lastQuarter: lastQuarter };
    }
  } catch (error) {
    return error.message;
  }
}

export async function fetchUnvettedTimeRange(transportType, published) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let thisWeek = [];
  let previousWeek = [];
  let lastFourWeeks = [];
  let url = `${process.env.NEXT_PUBLIC_APP_HOST}crime/unvetted/date?published=${published}`;

  if (transportType !== 'systemwide') {
    url += `&transport_type=${transportType}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data!');
    }

    const data = await response.json();

    if (data.length) {
      const datesObj = {};

      data.forEach((dateObj, dateObjIndex) => {
        const date = Object.keys(dateObj)[0];
        const [year, month] = date.split('-');
        const weeks = Object.values(dateObj)[0];

        weeks.reverse().forEach((week) => {
          if (week && thisWeek.length === 0) {
            thisWeek.push(`${year}-${month}-1-${week}`);
            lastFourWeeks.push(`${year}-${month}-1-${week}`);
            return;
          }

          if (week && previousWeek.length === 0) {
            previousWeek.push(`${year}-${month}-1-${week}`);
            lastFourWeeks.push(`${year}-${month}-1-${week}`);
            return;
          }

          if (week && lastFourWeeks.length <= 3) {
            lastFourWeeks.push(`${year}-${month}-1-${week}`);
            return false;
          }
        });

        weeks.reverse();

        if (!datesObj[year]) {
          datesObj[year] = {};
        }

        if (!datesObj[year].hasOwnProperty(month)) {
          datesObj[year][monthNames[month - 1]] = weeks;
        }
      });

      const dates = [];

      for (const [year, months] of Object.entries(datesObj)) {
        const weeksArr = [];

        for (const [month, weeks] of Object.entries(months)) {
          weeksArr.push(weeks);
        }

        dates.push({
          year,
          months: Object.keys(months).reverse(),
          weeks: weeksArr.reverse()
        });
      }

      dates.reverse();

      dates.forEach((dateObj) => {
        dateObj.selectedWeeks = [];

        lastFourWeeks.forEach((date) => {
          const [year] = date.split('-');

          if (dateObj.year === year) {
            dateObj.selectedWeeks.push(date);
          }
        });
      });
      // console.log(thisWeek)
      // console.log(previousWeek)
      // console.log(lastFourWeeks)

      return { dates, thisWeek, previousWeek, lastFourWeeks: lastFourWeeks.reverse() };
    }
  } catch (error) {
    return error.message;
  }
}

export async function getUCR(statType, transportType, vetted, severity) {
  let url = `${process.env.NEXT_PUBLIC_APP_HOST}${statType}?severity=${severity}`;

  if (transportType !== 'systemwide') {
    url += `&transport_type=${transportType}`;
  }

  if (statType === 'crime') {
    url += `&vetted=${vetted}`;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data!');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return error.message;
  }
}
