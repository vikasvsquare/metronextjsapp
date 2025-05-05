'use client';
import React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import { useSession } from 'next-auth/react';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchTimeRange, fetchUnvettedTimeRange, getUCR } from '@/lib/action';
import ApexLineChart from '@/components/charts/ApexLineChart'
import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import Loader from '@/components/ui/loader';
import GeoMapTabs from '@/components/GeoMapTabs';
import LineChartLegend from '@/components/ui/LineChartLegend';
import ReactApexchart from '@/components/charts/ReactApexchart';
import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaTrain, FaCalendarAlt } from 'react-icons/fa';
import ReactApexchartBar2 from '@/components/charts/ReactApexchartBar2';
import SelectRoutes from '@/components/SelectRoutes';
import SelectDateDropdown from '@/components/SelectDateDropdown';
import SelectDate from '@/components/SelectDate';
import ReactApexchartLine from '@/components/charts/ReactApexchartLine';
import CheckBoxDropdown from '@/components/ui/CheckBoxDropdown';
import SelectCustomDate from '@/components/SelectCustomDate';
import { getStartDateOfWeek } from '@/app/utils/dateUtils';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];
let thisWeek = [];
let previousWeek = [];
let lastFourWeeks = [];


export default function Home() {
  const [filter, setFilter] = React.useState('All');
  const filterTypes = ['All', 'Persons', 'Property', 'Society'];
  // const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [barWeeklyData, setWeeklyBarData] = useState({});
  const [lineWeeklyData, setLineWeeklyData] = useState({});

  const [filters, setFilters] = useState({
    crime_name: [],
    station_name: [],
    crime_against: [],
    line_name: []
  });
  const [unvettedCrimeName, setUnvettedCrimeName] = useState([]);
  const [unvettedRoute, setUnvettedRouteNAme] = useState([]);
  const [unvettedStation, setUnvettedStation] = useState([]);
  const [unvettedLineName, setUnvettedLineName] = useState(['persons', 'property', 'society']);
  const [dateData, setDateData] = useState([]);
  const [totalSelectedDates1, setTotalSelectedDates] = useState([]);
  const [totalSelectedDates2, setTotalSelectedDates2] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const isFirstRender = useRef(true);

  const [sectionVisibility, setSectionVisibility] = useState({
    agencyBar: false,
    agencyLine: false,
    systemWideBar: false,
    systemWideLine: false,
    violentBar: false,
    violentLine: false
  });


  const [ucrData, setUcrData] = useState({});
  const [vetted, setVetted] = useState(true);
  const [published, setPublished] = useState(true);

  const searchData = searchParams.get('line');
  const crimeLine = searchParams.get('crimeLine');
  const mapType = searchParams.get('type');
  const vettedType = searchParams.get('vetted');
  const GeoMap = searchParams.get('type');
  const publishType = searchParams.get('published');


  let totalSelectedDates = [];
  let latestDate = null;
  useEffect(() => {
    if (vetted && thisMonth?.length) {
      latestDate = dayjs(thisMonth).format('MMMM YYYY');
      localStorage.setItem('latestDate', latestDate);
    } else if (!vetted && thisWeek?.length) {
      latestDate = dayjs([thisWeek[0].slice(0, -3)]).format('MMMM YYYY');
      localStorage.setItem('latestDate', latestDate);
    }
  }, [vetted])


  useEffect(() => {
    if (dateData) {
      dateData?.forEach((dateObj) => {
        if (dateObj.hasOwnProperty('selectedMonths')) {
          totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedMonths];
          setTotalSelectedDates(totalSelectedDates);
        } else if (dateObj.hasOwnProperty('selectedWeeks')) {
          totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedWeeks];
          setTotalSelectedDates(totalSelectedDates);
        }
      });
    }

  }, [dateData])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

  useEffect(() => {
    if (vettedType && vettedType === "false") {
      setVetted(false);
    }
    if (vettedType && vettedType === "true") {
      setVetted(true);
    }
  }, [vettedType])

  //check publish flag in url
  useEffect(() => {
    if (typeof (publishType) === 'object') {
      setPublished(true)
    }
    if (publishType && publishType === 'true') {
      setPublished(true)
    }
    if (publishType && publishType === 'false') {
      setPublished(false)
    }
  }, [publishType])

  // open select date dropdown and click outside 
  useEffect(() => {
    if (!isDateDropdownOpen) return;

    function handleClick(e) {
      if (isDateDropdownOpen && !dateDropdownRef.current?.contains(e.target)) {
        setIsDateDropdownOpen(false);
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isDateDropdownOpen]);


  useEffect(() => {
    async function fetchDates() {
      if (vetted) {
        //for getting monthly data
        const result = await fetchTimeRange(STAT_TYPE, TRANSPORT_TYPE, published, vetted);
        setIsDateDropdownOpen(false);
        setDateData(result?.dates);
        setIsYearDropdownOpen(() => {
          const newIsYearDropdownOpen = {};

          result?.dates.forEach((dateObj) => {
            newIsYearDropdownOpen[dateObj.year] = {
              active: false
            };
          });

          return newIsYearDropdownOpen;
        });

        thisMonth = result?.thisMonth;
        previousMonth = result?.previousMonth;
        lastQuarter = result?.lastQuarter;
      } else {
        //for getting weekly data
        const result = await fetchUnvettedTimeRange(TRANSPORT_TYPE, published);
        setIsDateDropdownOpen(false);
        setDateData(result?.dates);
        setIsYearDropdownOpen(() => {
          const newIsYearDropdownOpen = {};

          result?.dates.forEach((dateObj) => {
            newIsYearDropdownOpen[dateObj.year] = {
              active: false
            };
          });

          return newIsYearDropdownOpen;
        });
        setIsMonthDropdownOpen(() => {
          const newIsMonthDropdownOpen = {};

          result?.dates.forEach((dateObj) => {
            dateObj.months.forEach((month) => {
              if (!newIsMonthDropdownOpen.hasOwnProperty(dateObj.year)) {
                newIsMonthDropdownOpen[dateObj.year] = {};
              }

              newIsMonthDropdownOpen[dateObj.year][month] = {
                active: false
              };
            });
          });

          return newIsMonthDropdownOpen;
        });

        thisWeek = result?.thisWeek;
        previousWeek = result?.previousWeek;
        lastFourWeeks = result?.lastFourWeeks.reverse();
      }
    }

    async function fetchUCR(severity) {
      const result = await getUCR(STAT_TYPE, TRANSPORT_TYPE, vetted, severity);

      if (result.length) {
        setUcrData((prevUcrState) => {
          const newUcrState = { ...prevUcrState };

          if (!newUcrState.hasOwnProperty(severity)) {
            newUcrState[severity] = {};
          }

          newUcrState[severity].allUcrs = result.sort();
          newUcrState[severity].selectedUcr = '';

          return newUcrState;
        });
      }
    }

    fetchDates();
    // fetchUCR('violent_crime');
    fetchUCR('systemwide_crime');
    fetchUCR('agency_wide');
  }, [vetted, published]);

  useEffect(() => {
    if (totalSelectedDates1?.length === 0 || Object.keys(ucrData).length === 0 || searchData === '') {
      return;
    }

    async function fetchBarChart(section) {
      if (vetted) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              line_name: crimeLine !== 'all' ? crimeLine : '',
              transport_type: TRANSPORT_TYPE,
              vetted: vetted,
              dates: totalSelectedDates1,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: published,
              graph_type: 'bar'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data!');
          }

          const data = await response.json();
          setBarData((prevBarData) => {
            const newBarChartState = { ...prevBarData };
            newBarChartState[section] = data['crime_bar_data'];

            return newBarChartState;
          });
        } catch (error) {
          console.log("errrorrr", error);
        }
      } else {
        const weeksPerMonth = [];

        totalSelectedDates1.forEach((dateWeek, dateWeekIndex) => {
          const [year, month, day, week] = dateWeek.split('-');
          const date = `${year}-${month}-${day}`;

          if (!weeksPerMonth.hasOwnProperty(date)) {
            weeksPerMonth[date] = [];
          }
          if (week) {
            const strArray = week.split(',');
            const numbers = strArray.map(num => parseInt(num, 10));
            numbers.forEach(number => {
              weeksPerMonth[date].push(number);
            });
          }

        });
        const dates = [];

        for (const [key, value] of Object.entries(weeksPerMonth)) {
          dates.push({
            [key]: value
          });
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/data`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              line_name: crimeLine !== 'all' ? crimeLine : '',
              transport_type: TRANSPORT_TYPE,
              dates: dates,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: published,
              graph_type: 'bar'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data!');
          }

          const data = await response.json();
          setBarData((prevBarData) => {
            const newBarChartState = { ...prevBarData };
            newBarChartState[section] = data['crime_unvetted_bar_data'];

            return newBarChartState;
          });
        } catch (error) {
          console.log("errrorrr", error);
          // console.log("""error""", error);
        }
      }
    }

    async function fetchLineChart(section) {
      if (vetted) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              line_name: crimeLine !== 'all' ? crimeLine : '',
              transport_type: TRANSPORT_TYPE,
              vetted: vetted,
              dates: totalSelectedDates1,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: published,
              graph_type: 'line'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data!');
          }

          const data = await response.json();
          const transformedData =
            data['crime_line_data'] &&
            data['crime_line_data']
              .sort((a, b) => new Date(a.name) - new Date(b.name))
              .map((item) => {
                return {
                  ...item,
                  name: dayjs(item.name).format('MMM YY')
                };
              });

          setLineChartData((prevLineState) => {
            const newBarChartState = { ...prevLineState };
            newBarChartState[section] = transformedData;

            return newBarChartState;
          });
        } catch (error) {
          console.log("errrorrr", error);
        }
      } else {
        const weeksPerMonth = [];

        totalSelectedDates1.forEach((dateWeek, dateWeekIndex) => {
          const [year, month, day, week] = dateWeek.split('-');
          const date = `${year}-${month}-${day}`;

          if (!weeksPerMonth.hasOwnProperty(date)) {
            weeksPerMonth[date] = [];
          }

          if (week) {
            const strArray = week.split(',');
            const numbers = strArray.map(num => parseInt(num, 10));
            numbers.forEach(number => {
              weeksPerMonth[date].push(number);
            });
          }
        });

        const dates = [];

        for (const [key, value] of Object.entries(weeksPerMonth)) {
          dates.push({
            [key]: value
          });
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/data`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              line_name: crimeLine !== 'all' ? crimeLine : '',
              transport_type: TRANSPORT_TYPE,
              dates: dates,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: published,
              graph_type: 'line'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data!');
          }

          const data = await response.json();
          const transformedData =
            data['crime_unvetted_line_data'] &&
            data['crime_unvetted_line_data'].map((item) => {
              return {
                ...item,
                name: item.name
              };
            });

          setLineChartData((prevLineState) => {
            const newBarChartState = { ...prevLineState };
            newBarChartState[section] = transformedData;

            return newBarChartState;
          });
        } catch (error) {
          console.log("errrorrr", error);
        }
      }
    }

    async function fetchAgencyWideBarChart(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: crimeLine !== 'all' ? crimeLine : '',
            transport_type: TRANSPORT_TYPE,
            vetted: vetted,
            dates: totalSelectedDates1,
            // severity: section,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            published: published,
            graph_type: 'bar'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();

        setBarData((prevBarData) => {
          const newBarChartState = { ...prevBarData };
          newBarChartState[section] = data['agency_wide_bar_data'];

          return newBarChartState;
        });
      } catch (error) {
        console.log("errrorrr", error);
      }
    }

    async function fetchAgencyWideLineChart(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
            dates: totalSelectedDates1,
            transport_type: TRANSPORT_TYPE,
            // severity: section,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            vetted: vetted,
            published: published,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['agency_wide_line_data'] &&
          data['agency_wide_line_data'].map((item) => {
            return {
              ...item,
              name: dayjs(item.name).format('MMM YY')
            };
          });

        setLineAgencyChartData((prevLineState) => {
          const newBarChartState = { ...prevLineState };
          newBarChartState[section] = transformedData;

          return newBarChartState;
        });
      } catch (error) {
        console.log("errrorrr", error);
      }
    }

    // fetchBarChart('violent_crime');
    fetchBarChart('systemwide_crime');

    // fetchLineChart('violent_crime');
    fetchLineChart('systemwide_crime');

    if (vetted) {
      fetchAgencyWideBarChart('agency_wide');
      fetchAgencyWideLineChart('agency_wide');
      
    }
    
  }, [vetted, totalSelectedDates1, ucrData, searchData, published, crimeLine]);


  function handleDateDropdownClick() {
    setIsDateDropdownOpen((prevDatePickerState) => {
      return !prevDatePickerState;
    });
  }

  function handleYearDropdownClick(year, shouldOpen) {
    setIsYearDropdownOpen((prevIsYearDropdownOpen) => {
      const newIsYearDropdownOpen = { ...prevIsYearDropdownOpen };
      newIsYearDropdownOpen[year].active = shouldOpen;
      return newIsYearDropdownOpen;
    });
  }

  function handleMonthDropdownClick(year, month, shouldOpen) {
    setIsMonthDropdownOpen((prevIsMonthDropdownOpen) => {
      const newIsMonthDropdownOpen = { ...prevIsMonthDropdownOpen };
      newIsMonthDropdownOpen[year][month].active = shouldOpen;
      return newIsMonthDropdownOpen;
    });
  }

  function handleYearCheckboxClick(e, year, months) {
    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (vetted) {
              const dates = months.map((month, index) => {
                const monthIndex = (MONTH_NAMES.indexOf(month)) + 1;
                return `${year}-${monthIndex}-1`;
              });

              dateObj.selectedMonths = [...dates];
            } else {
              const dateWeeks = dateObj.weeks
                .map((weeksArr, weeksArrIndex) => {
                  const monthNumber = MONTH_NAMES.indexOf(dateObj.months[weeksArrIndex]) + 1;
                  const dates = weeksArr.map((week) => `${year}-${monthNumber}-1-${week}`);
                  return [...dates];
                })
                .flat(1);

              dateObj.selectedWeeks = [...dateWeeks];
            }
          }
        });

        return newDateData;
      });
    } else {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (vetted) {
              dateObj.selectedMonths = [];
            } else {
              dateObj.selectedWeeks = [];
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleMonthCheckboxClick(e, date, weeksinThisMonth) {
    const year = date.split('-')[0];

    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (vetted && !dateObj.hasOwnProperty('selectedMonths')) {
              dateObj.selectedMonths = [];
            } else if (!vetted && !dateObj.hasOwnProperty('selectedWeeks')) {
              dateObj.selectedWeeks = [];
            }

            if (vetted && dateObj.selectedMonths.indexOf(date) === -1) {
              dateObj.selectedMonths.push(date);
            } else if (!vetted) {
              dateObj.selectedWeeks = [...dateObj.selectedWeeks, ...weeksinThisMonth];
            }
          }
        });

        return newDateData;
      });
    } else {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (vetted && dateObj.hasOwnProperty('selectedMonths')) {
              if (dateObj.selectedMonths.indexOf(date) > -1) {
                dateObj.selectedMonths.splice(dateObj.selectedMonths.indexOf(date), 1);
              }
            } else if (!vetted && dateObj.hasOwnProperty('selectedWeeks')) {
              dateObj.selectedWeeks = [];
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleWeekCheckboxClick(e, date) {
    const year = date.split('-')[0];

    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (!dateObj.hasOwnProperty('selectedWeeks')) {
              dateObj.selectedWeeks = [];
            }

            if (dateObj.selectedWeeks.indexOf(date) === -1) {
              dateObj.selectedWeeks.push(date);
            }
          }
        });

        return newDateData;
      });
    } else {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (dateObj.hasOwnProperty('selectedWeeks')) {
              if (dateObj.selectedWeeks.indexOf(date) > -1) {
                dateObj.selectedWeeks.splice(dateObj.selectedWeeks.indexOf(date), 1);
              }
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleMonthFilterClick(datesArr) {
    setDateData((prevDateData) => {
      const newDateData = [...prevDateData];

      newDateData.forEach((dateObj) => {
        dateObj.selectedMonths = [];

        datesArr.forEach((date) => {
          const [year] = date.split('-');

          if (dateObj.year === year) {
            dateObj.selectedMonths.push(date);
          }
        });
      });

      return newDateData;
    });
  }

  function handleWeekFilterClick(datesArr) {
    setDateData((prevDateData) => {
      const newDateData = [...prevDateData];

      newDateData.forEach((dateObj) => {
        dateObj.selectedWeeks = [];

        datesArr.forEach((date) => {
          const [year] = date.split('-');

          if (dateObj.year === year) {
            dateObj.selectedWeeks.push(date);
          }
        });
      });

      return newDateData;
    });
  }

  function handleCrimeCategoryChange(severity, crimeCategory) {
    setUcrData((prevUcrState) => {
      const newUcrState = { ...prevUcrState };
      newUcrState[severity].selectedUcr = crimeCategory;
      return newUcrState;
    });
  }


  // on page load getting crime Overview data with weekly  - new feature
  async function fetchWeeklyLineChart(section) {
    const weeksPerMonth = [];

    totalSelectedDates2.forEach((dateWeek, dateWeekIndex) => {
      const [year, month, day, week] = dateWeek.split('-');
      const date = `${year}-${month}-${day}`;

      if (!weeksPerMonth.hasOwnProperty(date)) {
        weeksPerMonth[date] = [];
      }
      if (week) {
        const strArray = week.split(',');
        const numbers = strArray.map(num => parseInt(num, 10));
        numbers.forEach(number => {
          weeksPerMonth[date].push(number);
        });
      }

    });
    const dates = [];

    for (const [key, value] of Object.entries(weeksPerMonth)) {
      dates.push({
        [key]: value
      });
    }
    console.log(dates)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/data`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_name: searchData !== 'all' ? searchData : '',
          transport_type: TRANSPORT_TYPE,
          dates: dates,
          severity: section,
          crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
          published: true,
          graph_type: 'line',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      // const data = await response.json();
      // setLineWeeklyData((prevBarData) => {
      //   const newBarChartState = { ...prevBarData };
      //   newBarChartState[section] = data['crime_unvetted_line_data'];

      //   return newBarChartState;
      // });
      const data = await response.json();

      const transformedData = data['crime_unvetted_line_data'].map(item => ({
        ...item,
        name: getStartDateOfWeek(item.name),
      }));

      setLineWeeklyData((prevBarData) => {
        const newBarChartState = { ...prevBarData };
        newBarChartState[section] = transformedData;
        return newBarChartState;
      });
    } catch (error) {
      console.log("errrorrr", error);
    }
  }
  async function fetchCrimeUnvettedCategories(categoryName) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/categories`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category_name: categoryName,
          transport_type: TRANSPORT_TYPE,
          published: true,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      if (categoryName === 'line_name') {
        setUnvettedRouteNAme(data['crime_unvetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
      if (categoryName === 'crime_name') {
        setUnvettedCrimeName(data['crime_unvetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
      if (categoryName === 'station_name') {
        setUnvettedStation(data['crime_unvetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
    } catch (error) {
      console.log("errrorrr", error);
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip first render
    }
    const hasAnyFilter =
      filters.crime_name.length > 0 ||
      filters.station_name.length > 0 ||
      filters.crime_against.length > 0 ||
      filters.line_name.length > 0;

    const hasAnyEmptyFilter =
      filters.crime_name.length === 0 ||
      filters.station_name.length === 0 ||
      filters.crime_against.length === 0 ||
      filters.line_name.length === 0;

    if (hasAnyFilter || hasAnyEmptyFilter) {
      
      fetchWeeklyLineChart('systemwide_crime');
    }
  }, [filters])

  useEffect(() => {
    fetchCrimeUnvettedCategories('crime_name');
    fetchCrimeUnvettedCategories('station_name');
    fetchCrimeUnvettedCategories('line_name');
    
  }, [])

  useEffect(() => {
    if (totalSelectedDates2.length > 0) {
      // fetchWeeklyBarChart('systemwide_crime');
      fetchWeeklyLineChart('systemwide_crime');
      
    }
  }, [totalSelectedDates2])

  const handleUnvettedFilterChange = (name, selected) => {
    setFilters((prev) => ({ ...prev, [name]: selected }));
  };

  return (
    <>
      {mapType === 'geomap' && (
        <div className="Bar-Graph w-100 p-4 bg-white metro__section-card">
          <div className={`${GeoMap === 'geomap' ? '!w-full' : 'sidebar-content '}`} style={GeoMap === 'geomap' ? { width: '100% !important' } : {}}>
            <iframe
              title="Map"
              style={{ width: '100%', height: '800px' }}
              src={process.env.NEXT_PUBLIC_CRIME_RAIL}
              frameborder="0"
              allowFullScreen="true"
            ></iframe>
          </div>
        </div>
      )}
      <div className="Bar-Graph w-100 p-4 bg-white metro__section-card">
        <div className="d-flex flex-wrap gap-3 w-100">
          {/* <SelectRoutes vetted1={true} transport1='rail' stat_type1='crime' /> */}
          <CheckBoxDropdown name={'line_name'} options={unvettedRoute} label={'Route'} onChange={handleUnvettedFilterChange} uniqueId="crimerail1" />
          <SelectCustomDate vetted={false} stat_type={'crime'} transport_type={'rail'} published={true} setTotalSelectedDates2={setTotalSelectedDates2} />
          <CheckBoxDropdown name={'crime_name'} options={unvettedCrimeName} label={'Crime Name'} onChange={handleUnvettedFilterChange} uniqueId="crimerail2" />
          <CheckBoxDropdown name={'station_name'} options={unvettedStation} label={'Station Name'} onChange={handleUnvettedFilterChange} uniqueId="crimerail3" />
          <CheckBoxDropdown name={'crime_against'} options={unvettedLineName} label={'Crime Against'} onChange={handleUnvettedFilterChange} uniqueId="crimerail4" />
        </div>
        {/* {barWeeklyData.systemwide_crime && <ReactApexchart chartData1={barWeeklyData.systemwide_crime} />} */}
        {lineWeeklyData.systemwide_crime && <ReactApexchartLine chartData1={lineWeeklyData.systemwide_crime} />}
      </div>

      <div className="py-3 rounded mt-3">
        <div className="align-items-center d-flex items-center justify-between">
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="mb-3 metro__main-title mt-3">Crime by Type</h5>
            {ucrData.systemwide_crime && ucrData.systemwide_crime.allUcrs && (
              <ButtonGroup>
                <ToggleButton
                  key="all"
                  id="radio-all"
                  type="radio"
                  variant={ucrData.systemwide_crime.selectedUcr === '' ? 'primary' : 'outline-secondary'}
                  name="ucrType"
                  value=""
                  checked={ucrData.systemwide_crime.selectedUcr === ''}
                  onChange={() => handleCrimeCategoryChange('systemwide_crime', '')}
                >
                  All
                </ToggleButton>

                {ucrData.systemwide_crime.allUcrs.map((ucr, idx) => (
                  <ToggleButton
                    key={ucr}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={ucrData.systemwide_crime.selectedUcr === ucr ? 'primary' : 'outline-secondary'}
                    name="ucrType"
                    value={ucr}
                    checked={ucrData.systemwide_crime.selectedUcr === ucr}
                    onChange={() => handleCrimeCategoryChange('systemwide_crime', ucr)}
                  >
                    {ucr}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            )}

          </Col>

          <div className="w-100 d-flex gap-3">
            <div className="d-flex flex-column gap-2">
              <SelectRoutes vetted1={true} transport1='rail' stat_type1='crime' globalType={false} />
            </div>
            <div className="d-flex flex-column gap-2">
              <p className="mb-1 metro__dropdown-label">Date</p>
              <div className="md:basis-3/12">
                <div className="relative">
                  {mapType !== 'geomap' && (
                    <>
                      <div
                        className="absolute bg-white "
                        style={{
                          width: '237px',
                          height: '32px',
                          borderRadius: '4px',
                          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 4px 0px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 10px'
                        }}
                        onClick={handleDateDropdownClick}
                        ref={dateDropdownRef}
                      >
                        <div className="flex gap-3 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                            <path d="M15.6 9.69727C15.975 9.96419 16.3094 10.2669 16.6031 10.6055C16.8969 10.944 17.15 11.3151 17.3625 11.7188C17.575 12.1224 17.7313 12.5488 17.8313 12.998C17.9313 13.4473 17.9875 13.9062 18 14.375C18 15.1497 17.8594 15.8789 17.5781 16.5625C17.2969 17.2461 16.9094 17.8418 16.4156 18.3496C15.9219 18.8574 15.35 19.2578 14.7 19.5508C14.05 19.8438 13.35 19.9935 12.6 20C12.0312 20 11.4813 19.9121 10.95 19.7363C10.4188 19.5605 9.93125 19.3066 9.4875 18.9746C9.04375 18.6426 8.65 18.2454 8.30625 17.7832C7.9625 17.321 7.69688 16.8099 7.50938 16.25H0V1.25H2.4V0H3.6V1.25H12V0H13.2V1.25H15.6V9.69727ZM1.2 2.5V5H14.4V2.5H13.2V3.75H12V2.5H3.6V3.75H2.4V2.5H1.2ZM7.22813 15C7.20938 14.7982 7.2 14.5898 7.2 14.375C7.2 13.8151 7.275 13.2715 7.425 12.7441C7.575 12.2168 7.80313 11.7188 8.10938 11.25H7.2V10H8.4V10.8398C8.65625 10.5078 8.94063 10.2148 9.25313 9.96094C9.56563 9.70703 9.90313 9.48893 10.2656 9.30664C10.6281 9.12435 11.0063 8.98763 11.4 8.89648C11.7938 8.80534 12.1938 8.75651 12.6 8.75C13.225 8.75 13.825 8.85742 14.4 9.07227V6.25H1.2V15H7.22813ZM12.6 18.75C13.1813 18.75 13.725 18.6361 14.2313 18.4082C14.7375 18.1803 15.1813 17.8678 15.5625 17.4707C15.9438 17.0736 16.2438 16.6113 16.4625 16.084C16.6813 15.5566 16.7938 14.987 16.8 14.375C16.8 13.7695 16.6906 13.2031 16.4719 12.6758C16.2531 12.1484 15.9531 11.6862 15.5719 11.2891C15.1906 10.8919 14.7469 10.5794 14.2406 10.3516C13.7344 10.1237 13.1875 10.0065 12.6 10C12.0188 10 11.475 10.1139 10.9688 10.3418C10.4625 10.5697 10.0188 10.8822 9.6375 11.2793C9.25625 11.6764 8.95625 12.1387 8.7375 12.666C8.51875 13.1934 8.40625 13.763 8.4 14.375C8.4 14.9805 8.50938 15.5469 8.72813 16.0742C8.94688 16.6016 9.24688 17.0638 9.62813 17.4609C10.0094 17.8581 10.4531 18.1706 10.9594 18.3984C11.4656 18.6263 12.0125 18.7435 12.6 18.75ZM13.2 13.75H15V15H12V11.25H13.2V13.75ZM2.4 10H3.6V11.25H2.4V10ZM4.8 10H6V11.25H4.8V10ZM4.8 7.5H6V8.75H4.8V7.5ZM2.4 12.5H3.6V13.75H2.4V12.5ZM4.8 12.5H6V13.75H4.8V12.5ZM8.4 8.75H7.2V7.5H8.4V8.75ZM10.8 8.75H9.6V7.5H10.8V8.75ZM13.2 8.75H12V7.5H13.2V8.75Z" fill="#2A54A7" />
                          </svg>
                          <span className="text-center metro__color-blue">Select Date</span>
                          <span className="basis-3/12 max-w-6 w-full h-6">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                              className={`w-full h-full${isDateDropdownOpen ? ' rotate-180' : ''}`}
                            >
                              <path
                                fill="#000"
                                stroke="white"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m17 10l-5 5l-5-5"
                              />
                            </svg>
                          </span>
                        </div>
                        <Suspense fallback={<Loader />}>
                          <ul
                            className={`${isDateDropdownOpen ? 'flex' : 'hidden'} flex-col bg-white rounded-lg px-2.5 pb-4 max-h-80 overflow-y-scroll mt-2 border-2 metro__custom-dp`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {dateData &&
                              dateData.map((date) => (
                                <li className="block py-2.5 border-b border-solid border-slate-300" key={date.year}>
                                  <label className="flex justify-start text-black px-2.5">
                                    <input
                                      type="checkbox"
                                      className="basis-2/12 max-w-4"
                                      name={date.year}
                                      id={date.year}
                                      checked={
                                        vetted ?
                                          (date.selectedMonths && date.selectedMonths.length === date.months.length) :
                                          (date.selectedWeeks && date.selectedWeeks.length === date.weeks.flat(1).length)
                                      }
                                      onChange={(e) => handleYearCheckboxClick(e, date.year, date.months)}
                                    />
                                    <span className="basis-8/12 flex-grow text-center">{date.year}</span>
                                    <span className="basis-2/12 flex items-center ">
                                      <button
                                        className="inline-block h-5 w-5"
                                        onClick={() => handleYearDropdownClick(date.year, !isYearDropdownOpen[date.year].active)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="1em"
                                          height="1em"
                                          viewBox="0 0 24 24"
                                          className={`w-full h-full${isYearDropdownOpen[date.year].active ? ' rotate-180' : ''}`}
                                        >
                                          <path
                                            fill="none"
                                            stroke="black"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m17 10l-5 5l-5-5"
                                          />
                                        </svg>
                                      </button>
                                    </span>
                                  </label>
                                  {date.months.length && (
                                    <ul
                                      className={`${isYearDropdownOpen[date.year].active ? 'flex' : 'hidden'
                                        } flex-col bg-sky-100 rounded-lg px-1.5 pb-4 mt-2`}
                                    >
                                      {date.months.map((month, monthIndex) => {
                                        const monthNumber = MONTH_NAMES.indexOf(month) + 1;
                                        const key = `${date.year}-${monthNumber}-1`;

                                        let weeksInThisMonth = [];
                                        let selectedWeeksInThisMonth = [];

                                        if (!vetted && date.weeks && date.weeks[monthIndex].length) {
                                          weeksInThisMonth = date.weeks[monthIndex].map(
                                            (week) => `${date.year}-${monthNumber}-1-${week}`
                                          );

                                          selectedWeeksInThisMonth = date.selectedWeeks
                                            .filter((week) => week.startsWith(`${date.year}-${monthNumber}-1`))
                                            .sort();
                                        }

                                        return (
                                          <li className="block p-1.5 border-b border-solid border-slate-300" key={key}>
                                            <label className="flex justify-start text-black px-1.5">
                                              <input
                                                type="checkbox"
                                                className="basis-2/12 max-w-4"
                                                name={key}
                                                id={key}
                                                checked={
                                                  vetted ? (date.selectedMonths && date.selectedMonths.indexOf(key) > -1) :
                                                    (date.selectedWeeks && equal(selectedWeeksInThisMonth, weeksInThisMonth))
                                                }
                                                onChange={(e) => handleMonthCheckboxClick(e, key, weeksInThisMonth)}
                                              />
                                              <span className="basis-8/12 flex-grow text-center">{month}</span>
                                              <span className="basis-2/12 flex items-center">
                                                {date.weeks && date.weeks[monthIndex].length && (
                                                  <button
                                                    className="inline-block h-5 w-5"
                                                    onClick={() =>
                                                      handleMonthDropdownClick(
                                                        date.year,
                                                        month,
                                                        !isMonthDropdownOpen[date.year][month].active
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      xmlns="http://www.w3.org/2000/svg"
                                                      width="1em"
                                                      height="1em"
                                                      viewBox="0 0 24 24"
                                                      className={`w-full h-full${isMonthDropdownOpen[date.year][month].active ? ' rotate-180' : ''
                                                        }`}
                                                    >
                                                      <path
                                                        fill="none"
                                                        stroke="black"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="m17 10l-5 5l-5-5"
                                                      />
                                                    </svg>
                                                  </button>
                                                )}
                                              </span>
                                            </label>
                                            {date.weeks && date.weeks[monthIndex].length && (
                                              <ul
                                                className={`${isMonthDropdownOpen[date.year][month].active ? 'flex' : 'hidden'
                                                  } flex-col bg-sky-100 rounded-lg px-1.5 pb-4 mt-2`}
                                              >
                                                {date.weeks[monthIndex].map((week, weekIndex) => {
                                                  const weekCount = weekIndex + 1;
                                                  const key = `${date.year}-${monthNumber}-1-${week}`;

                                                  return (
                                                    <li className="block p-1.5 border-b border-solid border-slate-300" key={key}>
                                                      <label className="flex justify-start text-black px-1.5">
                                                        <input
                                                          type="checkbox"
                                                          className="mr-3"
                                                          name={key}
                                                          id={key}
                                                          checked={
                                                            (date.selectedMonths && date.selectedMonths.indexOf(key) > -1) ||
                                                            (date.selectedWeeks && date.selectedWeeks.indexOf(key) > -1)
                                                          }
                                                          onChange={(e) => handleWeekCheckboxClick(e, key)}
                                                        />
                                                        <span>{`Week ${weekCount}`}</span>
                                                        <span></span>
                                                      </label>
                                                    </li>
                                                  );
                                                })}
                                              </ul>
                                            )}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </li>
                              ))}
                          </ul>
                        </Suspense>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="Bar-Graph w-100 p-4 bg-white metro__section-card">
          {barData.systemwide_crime && <ReactApexchartBar2 chartData1={barData.systemwide_crime} />}
        </div>

        <div className="Bar-Graph w-100 p-4 bg-white metro__section-card">
          {lineChartData.systemwide_crime && <ReactApexchartLine chartData1={lineChartData.systemwide_crime} height={405} />}
        </div>

      </div>

      {typeof lineAgencyChartData.agency_wide !== 'undefined' && vetted && lineAgencyChartData.agency_wide?.length !== 0 && (
        <>
          <div className="align-items-center d-flex items-center justify-between mt-3">
            <Col md={6} className="mb-3 mb-md-0">
              <h5 className="mb-3 metro__main-title mt-3">Law Enforcement Analysis </h5>
              {ucrData.agency_wide && ucrData.agency_wide.allUcrs && (
                <ButtonGroup>
                  <ToggleButton
                    key="all"
                    id="radio-agency-all"
                    type="radio"
                    variant={ucrData.agency_wide.selectedUcr === '' ? 'primary' : 'outline-secondary'}
                    name="agencyCrimeType"
                    value=""
                    checked={ucrData.agency_wide.selectedUcr === ''}
                    onChange={() => handleCrimeCategoryChange('agency_wide', '')}
                  >
                    All
                  </ToggleButton>

                  {ucrData.agency_wide.allUcrs.map((ucr, idx) => (
                    <ToggleButton
                      key={ucr}
                      id={`radio-agency-${idx}`}
                      type="radio"
                      variant={ucrData.agency_wide.selectedUcr === ucr ? 'primary' : 'outline-secondary'}
                      name="agencyCrimeType"
                      value={ucr}
                      checked={ucrData.agency_wide.selectedUcr === ucr}
                      onChange={() => handleCrimeCategoryChange('agency_wide', ucr)}
                    >
                      {ucr}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              )}

            </Col>
          </div>
          <div className='row'>
            <div className='Bar-Graph  col-md-4'>
              <div className="w-100 mt-4 bg-white metro__section-card">
                {barData.agency_wide && <ReactApexchartBar2 chartData1={barData.agency_wide} height={373} />}
              </div>
            </div>
            <div className='col-md-8'>
              <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
                {lineAgencyChartData.agency_wide && <ReactApexchartLine chartData1={lineAgencyChartData.agency_wide} height={405} />}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
