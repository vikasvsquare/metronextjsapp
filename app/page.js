'use client';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  // const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [comments, setComments] = useState({});
  const [dateData, setDateData] = useState([]);
  const [totalSelectedDates1, setTotalSelectedDates] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});

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
  const mapType = searchParams.get('type');
  const vettedType = searchParams.get('vetted');
  const GeoMap = searchParams.get('type');
  // const publishType = searchParams.get('published');

  //modal open/close
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = (name) => {
    setSectionVisibility((prevState) => ({
      ...prevState,
      [name]: !prevState[name]
    }));
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSectionVisibility({
      agencyBar: false,
      agencyLine: false,
      ystemWideBar: false,
      systemWideLine: false,
      violentBar: false,
      violentLine: false
    });
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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

    fetchDates();

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

    fetchUCR('violent_crime');
    fetchUCR('systemwide_crime');
    fetchUCR('agency_wide');
  }, [vetted]);

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
              line_name: searchData !== 'all' ? searchData : '',
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
          console.log(error);
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
              line_name: searchData !== 'all' ? searchData : '',
              transport_type: TRANSPORT_TYPE,
              dates: dates,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: true,
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
          console.log(error);
        }
      }
    }

    fetchBarChart('violent_crime');
    fetchBarChart('systemwide_crime');

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
              line_name: searchData !== 'all' ? searchData : '',
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
          console.log(error);
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
              line_name: searchData !== 'all' ? searchData : '',
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
          console.log(error);
        }
      }
    }

    fetchLineChart('violent_crime');
    fetchLineChart('systemwide_crime');

    async function fetchAgencyWideBarChart(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
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
        console.log(error);
      }
    }

    if (vetted) {
      fetchAgencyWideBarChart('agency_wide');
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
        console.log(error);
      }
    }

    if (vetted) {
      fetchAgencyWideLineChart('agency_wide');
    }
  }, [vetted, totalSelectedDates1, ucrData, searchData, published]);



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

  function getModalTitle() {
    if (sectionVisibility.agencyBar || sectionVisibility.agencyLine) {
      return 'Law Enforcement Analysis';
    } else if (sectionVisibility.systemWideBar || sectionVisibility.systemWideLine) {
      return 'Crime Analysis';
    } else if (sectionVisibility.violentBar || sectionVisibility.violentLine) {
      return 'Violent Crime';
    } else {
      return '';
    }
  }

  async function publshUnPublishHandler() {
    try {
      let bodyObj = {};
      if (vetted) {
        bodyObj = {
          transport_type: TRANSPORT_TYPE,
          vetted: vetted,
          dates: totalSelectedDates1,
          published: !published,
          status: "monthly"
        }
      } else {
        const result = {};

        // Helper function to format the date keys
        const formatDateKey = (dateString) => {
          const [year, month, day] = dateString.split('-');
          return `${year}-${month}-${day}`;
        };

        // Group and aggregate values
        const dateMap = totalSelectedDates1.reduce((acc, item) => {
          const parts = item.split('-');
          const date = parts.slice(0, 3).join('-');
          const value = parts[3];

          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(value);
          return acc;
        }, {});

        // Format the results
        const formattedDates = [];
        for (const [date, values] of Object.entries(dateMap)) {
          // Sort and join the values into a string
          const valueString = values.sort((a, b) => a - b).join(', ');
          formattedDates.push({ [formatDateKey(date)]: [valueString] });
        }

        // Add additional properties
        result.dates = formattedDates;
        result.published = !published;
        result.transport_type = TRANSPORT_TYPE;
        result.vetted = vetted;
        result.status = 'weekly';
        bodyObj = result;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/update_date_details`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        // {"dates":["2023-12-1"],"published":false,"transport_type":"rail","vetted":true,"status":"monthly"}
        // {"dates":[{"2024-1-1":["52"]}],"published":true,"transport_type":"rail","vetted":false,"status":"weekly"} 
        body: JSON.stringify(bodyObj)
      });

      if (!response.ok) {
        throw new Error('Failed to update data!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className={`${GeoMap === 'geomap' ? '!w-full' : 'sidebar-content '}`} style={GeoMap === 'geomap' ? { width: '100% !important' } : {}}>
        <div className="container relative z-10" style={GeoMap === 'geomap' ? { padding: '0 !important' } : {}}>
          <div className="lg:flex lg:gap-8">
            <main className="lg:grow lg:basis-9/12 pb-7 lg:pb-8">

              <div className="relative z-30">
                <div className="bg-white md:flex md:items-center p-2 rounded-xl marginTop-93">
                  <div className="md:basis-3/12">
                    <div className="relative min-h-11">
                      {mapType !== 'geomap' && (
                        <>
                          <div
                            className="absolute bg-white border-end flex-auto h-auto left-0 p-2.5 rounded-0 rounded-lg subTopNav-selectDate top-0 w-full"
                            onClick={handleDateDropdownClick}
                            ref={dateDropdownRef}
                          >
                            <div className="flex justify-center items-center min-h-6">
                              <span className="text-center">Select Date</span>
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
                                className={`${isDateDropdownOpen ? 'flex' : 'hidden'} flex-col bg-white rounded-lg px-2.5 pb-4 max-h-80 overflow-y-scroll mt-2 border-2`}
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
                            {/* {session && (<button className={`${isDateDropdownOpen ? 'flex btn btn-success w-full' : 'hidden'}`} onClick={() => publshUnPublishHandler()}>{publishType === 'false' ? 'Publish' : 'Unpublish'}</button>)} */}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:basis-8/12 xl:basis-7/12 md:mt-0">
                    {mapType !== 'geomap' && (
                      <>
                        <ul className="select-date-ribbon sm:mb-0 md:gap-6">
                          <li>
                            {vetted ? (
                              <button
                                className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${thisMonth?.length && equal(thisMonth, totalSelectedDates1) ? 'current-days-active' : 'current-days-inactive'
                                  }`}
                                onClick={() => handleMonthFilterClick(thisMonth)}
                              >
                                <div className='flex flex-col items-center justify-center'>
                                  Current Month
                                  <span className='text-capitalize text-sm'>{`(${dayjs(thisMonth).format('MMM YY')})`}</span>
                                </div>
                              </button>
                            ) : (
                              <button
                                className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${thisWeek?.length && equal(thisWeek, totalSelectedDates1) ? 'current-days-active' : 'current-days-inactive'
                                  }`}
                                onClick={() => handleWeekFilterClick(thisWeek)}
                              >
                                Current Week
                              </button>
                            )}
                          </li>
                          <li>
                            {vetted ? (
                              <button
                                className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${previousMonth?.length && equal(previousMonth, totalSelectedDates1) ? 'current-days-active' : 'current-days-inactive'
                                  }`}
                                onClick={() => handleMonthFilterClick(previousMonth)}
                              >
                                <div className='flex flex-col items-center justify-center'>
                                  Last Two Months
                                  <span className='text-capitalize text-sm'>{`(${dayjs(previousMonth[1]).format('MMM YY')} - ${dayjs(previousMonth[0]).format('MMM YY')})`}</span>
                                </div>
                              </button>
                            ) : (
                              <button
                                className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${previousWeek?.length && equal(previousWeek, totalSelectedDates1) ? 'current-days-active' : 'current-days-inactive'
                                  }`}
                                onClick={() => handleWeekFilterClick(previousWeek)}
                              >
                                Last Week
                              </button>
                            )}
                          </li>
                          <li>
                            {vetted ? (
                              <button
                                className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${lastQuarter?.length && equal(lastQuarter, totalSelectedDates1) ? 'current-days-active' : 'current-days-inactive'
                                  }`}
                                onClick={() => handleMonthFilterClick(lastQuarter)}
                              >
                                <div className='flex flex-col items-center justify-center'>
                                  Last Quarter
                                  <span className='text-capitalize text-sm'>{`(${dayjs(lastQuarter[2]).format('MMM YY')} - ${dayjs(lastQuarter[0]).format('MMM YY')})`}</span>
                                </div>
                              </button>
                            ) : (
                              <button
                                className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${lastFourWeeks?.length && equal(lastFourWeeks, totalSelectedDates1) ? 'current-days-active' : 'current-days-inactive'
                                  }`}
                                onClick={() => handleWeekFilterClick(lastFourWeeks)}
                              >
                                Last Four Weeks
                              </button>
                            )}
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                  {!vetted && <GeoMapTabs mapType={mapType} createQueryString={createQueryString} />}
                </div>
                {mapType !== 'geomap' && (
                  <>
                    <div className="mb-1 sm:mb-4">
                      {!vetted && <h6 className="italic ml-auto w-max mt-1 primilary-text">*Preliminary under review data</h6>}
                    </div>
                  </>
                )}
              </div>

              {mapType !== 'geomap' ? (
                <>
                  {lineChartData.violent_crime?.length !== 0 && (
                    <div className="relative z-10  p-7 lg:py-8 lg:px-14 rounded-2xl paddingTop-0 !pr-0 contentGraph sm:p-0">
                      <div className="basis-10/12 xl:basis-4/12">

                        <div class="group relative">
                          <h2 className="main-content__h2 text-primary dark:text-primary-400" data-twe-toggle="tooltip"
                            title="Hi! I'm tooltip">
                            Violent Crime
                          </h2>
                          <span class="absolute top-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">✨ You hover me!</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center">
                        <div className="basis-full sm:basis-10/12 xl:basis-7/12 xl:mt-0">
                          <Suspense fallback={<Loader />}>
                            {ucrData.violent_crime && ucrData.violent_crime.allUcrs && (
                              <ul className="flex justify-between md:justify-start items-center md:gap-6">
                                {ucrData.violent_crime.allUcrs.map((ucr) => {
                                  const activeClassname =
                                    ucrData.violent_crime.selectedUcr === ucr
                                      ? ' text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                                      : ' text-slate-500';

                                  if (ucr === 'persons') return false;

                                  return (
                                    <li key={ucr}>
                                      <button
                                        className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}
                                        onClick={() => handleCrimeCategoryChange('violent_crime', ucr)}
                                      >
                                        {ucr}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </Suspense>
                        </div>
                      </div>
                      <Suspense fallback={<Loader />}>
                        {comments.violent_crime && (
                          <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.violent_crime}</p>
                        )}
                      </Suspense>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                        <div className="bg-white py-3 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-3">
                          <Image
                            alt="Crime Systemwide"
                            src="/assets/zoom.svg"
                            width={16}
                            height={16}
                            priority
                            onClick={() => handleOpenModal('violentBar')}
                            className='zoomPosition'
                          />
                          <Suspense fallback={<Loader />}>
                            {barData.violent_crime && <BarCharts chartData={barData.violent_crime} />}{' '}
                          </Suspense>
                        </div>
                        <div
                          className="bg-white py-5 px-4 text-slate-400 rounded-lg w-full pt-12 mt-3 relative"
                          style={{ fontSize: 11, padding: '3rem 0 0 0' }}
                        >
                          <Image
                            alt="Crime Systemwide"
                            src="/assets/zoom.svg"
                            width={16}
                            height={16}
                            priority
                            onClick={() => handleOpenModal('violentLine')}
                            className='zoomPosition'
                            style={{ top: 22 }}
                          />
                          <Suspense fallback={<Loader />}>
                            {lineChartData.violent_crime && <ApexLineChart chartData={lineChartData.violent_crime} />}
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  )}

                  {lineChartData.systemwide_crime?.length !== 0 && (
                    <div className="relative z-10  p-7 lg:py-8 lg:px-14 rounded-2xl paddingTop-0 !pr-0 contentGraph">
                      <div className="basis-10/12 xl:basis-4/12">
                        <h2 className="main-content__h2" title='Crime Analysis'>
                          Crime Analysis
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center">
                        <div className="basis-full sm:basis-10/12 xl:basis-7/12 xl:mt-0">
                          <Suspense fallback={<Loader />}>
                            {ucrData.systemwide_crime && ucrData.systemwide_crime.allUcrs && (
                              <ul className="flex justify-between md:justify-start items-center md:gap-6">
                                <li>
                                  <button
                                    className={`text-xs lg:text-base first-letter:capitalize ${ucrData.systemwide_crime.selectedUcr === ''
                                      ? 'text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                                      : 'text-slate-500'
                                      }`}
                                    onClick={() => handleCrimeCategoryChange('systemwide_crime', '')}
                                  >
                                    All
                                  </button>
                                </li>
                                {ucrData.systemwide_crime.allUcrs.map((ucr) => {
                                  const activeClassname =
                                    ucrData.systemwide_crime.selectedUcr === ucr
                                      ? ' text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                                      : ' text-slate-500';

                                  return (
                                    <li key={ucr}>
                                      <button
                                        className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}
                                        onClick={() => handleCrimeCategoryChange('systemwide_crime', ucr)}
                                      >
                                        {ucr}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </Suspense>
                        </div>
                      </div>
                      <Suspense fallback={<Loader />}>
                        {comments.systemwide_crime && (
                          <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                            {comments.systemwide_crime}
                          </p>
                        )}
                      </Suspense>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                        <div className="bg-white py-3 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-3">
                          <Image
                            alt="Crime Systemwide"
                            src="/assets/zoom.svg"
                            width={16}
                            height={16}
                            priority
                            onClick={() => handleOpenModal('systemWideBar')}
                            style={{ textAlign: 'right', float: 'right', marginTop: '3px', cursor: 'pointer', marginRight: '1rem', position: 'absolute', marginLeft: '5px', zIndex: '9999' }}
                          />
                          <Suspense fallback={<Loader />}>
                            {barData.systemwide_crime && <BarCharts chartData={barData.systemwide_crime} />}
                          </Suspense>
                        </div>
                        <div
                          className="bg-white py-5 px-4 text-slate-400 rounded-lg w-full pt-12 mt-3 relative"
                          style={{ fontSize: 11, padding: '3rem 0 0 0' }}
                        >
                          <Image
                            alt="Crime Systemwide"
                            src="/assets/zoom.svg"
                            width={16}
                            height={16}
                            priority
                            onClick={() => handleOpenModal('systemWideLine')}
                            className='zoomPosition'
                            style={{ top: 22 }}
                          />
                          <Suspense fallback={<Loader />}>
                            {lineChartData.systemwide_crime && <ApexLineChart chartData={lineChartData.systemwide_crime} />}
                          </Suspense>
                        </div>
                      </div>
                    </div>
                  )}

                  {vetted && lineAgencyChartData.agency_wide?.length !== 0 && (
                    <div className="relative z-10  p-7 lg:py-8 lg:px-14 rounded-2xl paddingTop-0 !pr-0 contentGraph">
                      <div className="basis-10/12 xl:basis-4/12">
                        <h2 className="main-content__h2" title='Law Enforcement Analysis'>
                          Law Enforcement Analysis
                        </h2>
                      </div>
                      <div className="flex flex-wrap items-center">
                        <div className="basis-full sm:basis-10/12 xl:basis-7/12 xl:mt-0">
                          <Suspense fallback={<Loader />}>
                            {ucrData.agency_wide && ucrData.agency_wide.allUcrs && (
                              <ul className="flex justify-between md:justify-start items-center md:gap-6">
                                <li>
                                  <button
                                    className={`text-xs lg:text-base first-letter:capitalize ${ucrData.agency_wide.selectedUcr === ''
                                      ? 'text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                                      : 'text-slate-500'
                                      }`}
                                    onClick={() => handleCrimeCategoryChange('agency_wide', '')}
                                  >
                                    All
                                  </button>
                                </li>
                                {ucrData.agency_wide.allUcrs.map((ucr) => {
                                  const activeClassname =
                                    ucrData.agency_wide.selectedUcr === ucr
                                      ? ' text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                                      : ' text-slate-500';

                                  return (
                                    <li key={ucr}>
                                      <button
                                        className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}
                                        onClick={() => handleCrimeCategoryChange('agency_wide', ucr)}
                                      >
                                        {ucr}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </Suspense>
                        </div>
                      </div>
                      <Suspense fallback={<Loader />}>
                        {comments.agency_wide && (
                          <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.agency_wide}</p>
                        )}
                      </Suspense>
                      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                        <div className="bg-white py-3 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-3">
                          <Image
                            alt="Crime Systemwide"
                            src="/assets/zoom.svg"
                            width={16}
                            height={16}
                            priority
                            onClick={() => handleOpenModal('agencyBar')}
                            style={{ textAlign: 'right', float: 'right', marginTop: '3px', cursor: 'pointer', marginRight: '1rem', position: 'absolute', marginLeft: '5px', zIndex: '9999' }}
                          />
                          <Suspense fallback={<Loader />}>
                            {barData.agency_wide && <BarCharts chartData={barData.agency_wide} legendLabel={true} />}
                          </Suspense>
                        </div>
                        <div
                          className="bg-white py-5 px-4 text-slate-400 rounded-lg w-full pt-12 mt-3 relative"
                          style={{ fontSize: 11, padding: '3rem 0 0 0' }}
                        >
                          <Image
                            alt="Crime Systemwide"
                            src="/assets/zoom.svg"
                            width={16}
                            height={16}
                            priority
                            onClick={() => handleOpenModal('agencyLine')}
                            className='zoomPosition'
                            style={{ top: 22 }}
                          />
                          <Suspense fallback={<Loader />}>
                            {lineAgencyChartData.agency_wide && <ApexLineChart chartData={lineAgencyChartData.agency_wide} />}
                          </Suspense>
                        </div>
                      </div>
                      <LineChartLegend />
                    </div>
                  )}
                </>
              ) : null}

              {/* displaying geomap */}
              {mapType === 'geomap' && (
                <div className={`relative z-10 rounded-2xl ${GeoMap === 'geomap' ? '' : ' p-7 lg:py-8 lg:px-14'}`}>
                  <>
                    <iframe
                      title="Map"
                      style={{ width: '100%', height: '800px' }}
                      src={process.env.NEXT_PUBLIC_CRIME_RAIL}
                      frameborder="0"
                      allowFullScreen="true"
                    ></iframe>
                  </>
                </div>
              )}
            </main>
          </div>
          <CustomModal title={getModalTitle()} isOpen={openModal} onClose={handleCloseModal}>
            {sectionVisibility.agencyBar && barData.agency_wide && <BarCharts chartData={barData.agency_wide} />}
            {sectionVisibility.agencyLine && lineAgencyChartData.agency_wide && <ApexLineChart chartData={lineAgencyChartData.agency_wide} />}
            {sectionVisibility.systemWideBar && barData.systemwide_crime && <BarCharts chartData={barData.systemwide_crime} />}
            {sectionVisibility.systemWideLine && lineChartData.systemwide_crime && <ApexLineChart chartData={lineChartData.systemwide_crime} />}
            {sectionVisibility.violentBar && barData.violent_crime && <BarCharts chartData={barData.violent_crime} />}
            {sectionVisibility.violentLine && lineChartData.violent_crime && <ApexLineChart chartData={lineChartData.violent_crime} />}
          </CustomModal>
        </div>

      </div>
    </>
  );
}
