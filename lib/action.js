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

export async function fetchTimeRange(statType, transportType, vetted) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let thisMonth = [];
  let previousMonth = [];
  let lastQuarter = [];
  let url = `${process.env.NEXT_PUBLIC_APP_HOST}${statType}/date_details?&published=true`;

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
      previousMonth = data.slice(1, 2);
      lastQuarter = data.slice(1, 4);

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

        thisMonth.forEach((date) => {
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
