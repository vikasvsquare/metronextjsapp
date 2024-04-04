export async function fetchAllLines(vetted) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}routes/?stat_type=crime&vetted=${vetted}&transport_type=rail`, {
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
    console.log(error);
    return error.message;
  }
}

export async function fetTimeRange(vetted) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_HOST}crime/date_details?published=true&transport_type=rail&vetted=${vetted}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

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
          months: months.reverse(),
          active: false
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

      return dates;
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
}
