'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchTimeRange, fetchUnvettedTimeRange, getUCR } from '@/lib/action';

import DashboardNav from '@/components/DashboardNav';
import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import LineChats from '@/components/charts/LineChats';
import Loader from '@/components/ui/loader';
import LineChartLegend from '@/components/ui/LineChartLegend';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'systemwide';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];
let thisWeek = [];
let previousWeek = [];
let lastFourWeeks = [];

function SystemWide() {
  const pathName = usePathname();
  const router = useRouter();

  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [comments, setComments] = useState({});
  const [dateData, setDateData] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [openModal, setOpenModal] = useState(false);
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

  let totalSelectedDates = [];
  let latestDate = null;

  if (vetted && thisMonth.length) {
    latestDate = dayjs(thisMonth).format('MMMM YYYY');
  } else if (!vetted && thisWeek.length) {
    latestDate = dayjs([thisWeek[0].slice(0, -3)]).format('MMMM YYYY');
  }

  if (dateData) {
    dateData?.forEach((dateObj) => {
      if (dateObj.hasOwnProperty('selectedMonths')) {
        totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedMonths];
      } else if (dateObj.hasOwnProperty('selectedWeeks')) {
        totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedWeeks];
      }
    });
  }

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
        const result = await fetchTimeRange(STAT_TYPE, TRANSPORT_TYPE, vetted);

        setIsDateDropdownOpen(false);
        setDateData(result.dates);
        setIsYearDropdownOpen(() => {
          const newIsYearDropdownOpen = {};

          result.dates.forEach((dateObj) => {
            newIsYearDropdownOpen[dateObj.year] = {
              active: false
            };
          });

          console.log(newIsYearDropdownOpen);

          return newIsYearDropdownOpen;
        });

        thisMonth = result.thisMonth;
        previousMonth = result.previousMonth;
        lastQuarter = result.lastQuarter;
      } else {
        const result = await fetchUnvettedTimeRange(TRANSPORT_TYPE);

        setIsDateDropdownOpen(false);
        setDateData(result.dates);
        setIsYearDropdownOpen(() => {
          const newIsYearDropdownOpen = {};

          result.dates.forEach((dateObj) => {
            newIsYearDropdownOpen[dateObj.year] = {
              active: false
            };
          });

          return newIsYearDropdownOpen;
        });
        setIsMonthDropdownOpen(() => {
          const newIsMonthDropdownOpen = {};

          result.dates.forEach((dateObj) => {
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

        thisWeek = result.thisWeek;
        previousWeek = result.previousWeek;
        lastFourWeeks = result.lastFourWeeks;
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

          newUcrState[severity].allUcrs = result;
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
    if (dateData.length === 0 || Object.keys(ucrData).length === 0) {
      return;
    }

    async function fetchComments(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/comment`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: 'all',
            transport_type: TRANSPORT_TYPE,
            vetted: vetted,
            dates: totalSelectedDates,
            section: section,
            published: true,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || ''
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();

        setComments((prevCommentsState) => {
          const newCommentsState = { ...prevCommentsState };
          newCommentsState[section] = data.comment;

          return newCommentsState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (vetted) {
      fetchComments('violent_crime');
      fetchComments('systemwide_crime');
      fetchComments('agency_wide');
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
              vetted: vetted,
              dates: totalSelectedDates,
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
            newBarChartState[section] = data['crime_bar_data'];

            return newBarChartState;
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        const weeksPerMonth = {};

        totalSelectedDates.forEach((dateWeek, dateWeekIndex) => {
          const [year, month, day, week] = dateWeek.split('-');
          const date = `${year}-${month}-${day}`;

          if (!weeksPerMonth.hasOwnProperty(date)) {
            weeksPerMonth[date] = [];
          }

          weeksPerMonth[date].push(week);
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
              vetted: vetted,
              dates: totalSelectedDates,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: true,
              graph_type: 'line'
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch data!');
          }

          const data = await response.json();
          const transformedData =
            data['crime_line_data'] &&
            data['crime_line_data'].map((item) => {
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
        const weeksPerMonth = {};

        totalSelectedDates.forEach((dateWeek, dateWeekIndex) => {
          const [year, month, day, week] = dateWeek.split('-');
          const date = `${year}-${month}-${day}`;

          if (!weeksPerMonth.hasOwnProperty(date)) {
            weeksPerMonth[date] = [];
          }

          weeksPerMonth[date].push(week);
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
              dates: dates,
              severity: section,
              crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
              published: true,
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
            vetted: vetted,
            dates: totalSelectedDates,
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
          newBarChartState[section] = data['agency_wide_bar_data'];

          return newBarChartState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchAgencyWideBarChart('agency_wide');

    async function fetchAgencyWideLineChart(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dates: totalSelectedDates,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            vetted: vetted,
            published: true,
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

    fetchAgencyWideLineChart('agency_wide');
  }, [vetted, dateData, ucrData]);

  function handleVettedToggle(value) {
    setVetted(value);
  }

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
      const dates = months.map((month, index) => {
        const monthIndex = index + 1;
        return `${year}-${monthIndex}-1`;
      });

      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (vetted) {
              dateObj.selectedMonths = [...dates];
            } else {
              dateObj.selectedWeeks = [...dates];
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
            } else if (!vetted && dateObj.selectedWeeks.indexOf(date) === -1) {
              dateObj.selectedWeeks = weeksinThisMonth;
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

        console.log(newDateData);

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

  function handleOpenModal(name) {
    setSectionVisibility((prevState) => ({
      ...prevState,
      [name]: !prevState[name]
    }));
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSectionVisibility({
      agencyBar: false,
      agencyLine: false,
      ystemWideBar: false,
      systemWideLine: false,
      violentBar: false,
      violentLine: false
    });
  }

  function getModalTitle() {
    if (sectionVisibility.agencyBar || sectionVisibility.agencyLine) {
      return 'Agencywide Analysis';
    } else if (sectionVisibility.systemWideBar || sectionVisibility.systemWideLine) {
      return 'Systemwide Crime';
    } else if (sectionVisibility.violentBar || sectionVisibility.violentLine) {
      return 'Violent Crime';
    } else {
      return '';
    }
  }

  return (
    <>
      <DashboardNav />
      <div className="container relative z-10">
        <div className="lg:flex lg:gap-8">
          <main className="lg:grow lg:basis-9/12 pb-7 lg:pb-8 mt-14">
            <div className="flex flex-col mb-5">
              {!vetted && <h6 className="text-sm xl:text-md italic text-slate-500 w-max ml-auto">*Preliminary under review data</h6>}
            </div>
            <div className="flex flex-wrap items-center justify-between mb-8">
              <h2 className="basis-full sm:basis-6/12 text-2xl lg:text-3xl font-scala-sans font-semibold mt-5 lg:mt-0">All Lines</h2>
              <div className="basis-full sm:basis-6/12 -order-1 sm:order-none flex items-center p-2 gap-2 bg-slate-100 rounded-lg">
                <button
                  className={`flex-auto rounded-lg px-4 py-2 flex justify-center items-center ${
                    vetted ? 'bg-gradient-to-r from-[#040E15] from-[5.5%] to-[#17527B] to-[93.69%] text-white' : 'bg-white'
                  }`}
                  onClick={() => handleVettedToggle(true)}
                >
                  <span>Monthly Data</span>
                </button>
                <button
                  className={`flex-auto rounded-lg px-4 py-2 flex justify-center items-center ${
                    !vetted ? 'bg-gradient-to-r from-[#040E15] from-[5.5%] to-[#17527B] to-[93.69%] text-white' : 'bg-white'
                  }`}
                  onClick={() => handleVettedToggle(false)}
                >
                  <span>Weekly Data</span>
                </button>
              </div>
            </div>
            {/* <p className="text-sm lg:text-base text-slate-500 mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            </p> */}
            <div className="relative z-30">
              <div className="flex flex-wrap items-center mb-1 sm:mb-4">
                <h5 className="basis-1/2 text-lg text-slate-400">Select Time Range</h5>
                <h6 className="text-sm xl:text-lg italic text-slate-500 w-max ml-auto mt-4 sm:mt-0">{latestDate}</h6>
              </div>
              <div className="md:flex md:items-center py-2 px-5 rounded-xl bg-gradient-to-r from-[#EAF7FF] from-[0%] to-[#ADDFFF] to-[106.61%]">
                <div className="md:basis-3/12">
                  <div className="relative min-h-11">
                    <div
                      className="absolute w-full h-auto top-0 left-0 p-2.5 flex-auto rounded-lg bg-[#032A43] text-white"
                      onClick={handleDateDropdownClick}
                      ref={dateDropdownRef}
                    >
                      <div className="flex justify-center items-center min-h-6">
                        <span className="flex-grow text-center">Select Date</span>
                        <span className="basis-3/12 max-w-6 w-full h-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                            className={`w-full h-full${isDateDropdownOpen ? ' rotate-180' : ''}`}
                          >
                            <path
                              fill="none"
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
                          className={`${
                            isDateDropdownOpen ? 'flex' : 'hidden'
                          } flex-col bg-white rounded-lg px-2.5 pb-4 max-h-80 overflow-y-scroll mt-2`}
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
                                      (date.selectedMonths && date.selectedMonths.length === date.months.length) ||
                                      (date.selectedWeeks && date.selectedWeeks.length === date.weeks.length)
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
                                    className={`${
                                      isYearDropdownOpen[date.year].active ? 'flex' : 'hidden'
                                    } flex-col bg-sky-100 rounded-lg px-1.5 pb-4 mt-2`}
                                  >
                                    {date.months.map((month, monthIndex) => {
                                      const monthNumber = MONTH_NAMES.indexOf(month) + 1;
                                      const key = `${date.year}-${monthNumber}-1`;

                                      let weeksinThisMonth = [];

                                      if (!vetted && date.weeks && date.weeks[monthIndex].length) {
                                        weeksinThisMonth = date.weeks[monthIndex].map((week) => `${date.year}-${monthNumber}-1-${week}`);
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
                                                (date.selectedMonths && date.selectedMonths.indexOf(key) > -1) ||
                                                (date.selectedWeeks && equal(date.selectedWeeks, weeksinThisMonth))
                                              }
                                              onChange={(e) => handleMonthCheckboxClick(e, key, weeksinThisMonth)}
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
                                                    className={`w-full h-full${
                                                      isMonthDropdownOpen[date.year][month].active ? ' rotate-180' : ''
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
                                              className={`${
                                                isMonthDropdownOpen[date.year][month].active ? 'flex' : 'hidden'
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
                  </div>
                </div>
                <div className="md:basis-1/12 xl:basis-2/12 hidden md:block xl:flex xl:justify-center xl:items-center">
                  <span className="hidden xl:inline-block xl:w-px xl:h-10 xl:bg-black"></span>
                </div>
                <div className="md:basis-8/12 xl:basis-7/12 mt-5 md:mt-0">
                  <ul className="flex justify-between md:justify-start items-center mb-4 sm:mb-0 md:gap-6">
                    <li>
                      {vetted ? (
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${
                            thisMonth.length && equal(thisMonth, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleMonthFilterClick(thisMonth)}
                        >
                          This month
                        </button>
                      ) : (
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${
                            thisWeek.length && equal(thisWeek, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleWeekFilterClick(thisWeek)}
                        >
                          This Week
                        </button>
                      )}
                    </li>
                    <li>
                      {vetted ? (
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${
                            previousMonth.length && equal(previousMonth, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleMonthFilterClick(previousMonth)}
                        >
                          Last Two Months
                        </button>
                      ) : (
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${
                            previousWeek.length && equal(previousWeek, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
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
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${
                            lastQuarter.length && equal(lastQuarter, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleMonthFilterClick(lastQuarter)}
                        >
                          Last Quarter
                        </button>
                      ) : (
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${
                            lastFourWeeks.length && equal(lastFourWeeks, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                          onClick={() => handleWeekFilterClick(lastFourWeeks)}
                        >
                          Last Four Weeks
                        </button>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* <div className="relative z-10 flex justify-end mt-4">
              <button className="inline-block rounded-lg pl-5 py-2 pr-11 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:right-6">
                <span>Export All</span>
              </button>
            </div> */}

            {lineChartData.violent_crime?.length !== 0 && (
              <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
                <div className="flex flex-wrap items-center">
                  <div className="basis-10/12 xl:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                      Violent Crime
                    </h2>
                  </div>
                  {/* <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                  <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                </div> */}
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0">
                    <Suspense fallback={<Loader />}>
                      {ucrData.violent_crime && ucrData.violent_crime.allUcrs && (
                        <ul className="flex justify-between md:justify-start items-center md:gap-6">
                          {/* <li>
                          <button
                            className={`text-xs lg:text-base first-letter:capitalize ${
                              ucrData.violent_crime.selectedUcr === ''
                                ? 'text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                                : 'text-slate-500'
                            }`}
                            onClick={() => handleCrimeCategoryChange('violent_crime', '')}
                          >
                            All
                          </button>
                        </li> */}
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
                  <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6 pt-12">
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('violentBar')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>{barData.violent_crime && <BarCharts chartData={barData.violent_crime} />}</Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('violentLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {lineChartData.violent_crime && <LineChats chartData={lineChartData.violent_crime} />}
                    </Suspense>
                  </div>
                </div>
              </div>
            )}

            {lineChartData.systemwide_crime?.length !== 0 && (
              <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
                <div className="flex flex-wrap items-center">
                  <div className="basis-10/12 xl:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                      Systemwide Crime
                    </h2>
                  </div>
                  {/* <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                  <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                </div> */}
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0">
                    <Suspense fallback={<Loader />}>
                      {ucrData.systemwide_crime && ucrData.systemwide_crime.allUcrs && (
                        <ul className="flex justify-between md:justify-start items-center md:gap-6">
                          <li>
                            <button
                              className={`text-xs lg:text-base first-letter:capitalize ${
                                ucrData.systemwide_crime.selectedUcr === ''
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
                    <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.systemwide_crime}</p>
                  )}
                </Suspense>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                  <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6 pt-12">
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('systemWideBar')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {barData.systemwide_crime && <BarCharts chartData={barData.systemwide_crime} />}
                    </Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('systemWideLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {lineChartData.systemwide_crime && <LineChats chartData={lineChartData.systemwide_crime} />}
                    </Suspense>
                  </div>
                </div>
              </div>
            )}

            {lineAgencyChartData.agency_wide?.length !== 0 && (
              <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
                <div className="flex flex-wrap items-center">
                  <div className="basis-10/12 xl:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                      Agencywide Analysis
                    </h2>
                  </div>
                  {/* <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                  <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                </div> */}
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0">
                    <Suspense fallback={<Loader />}>
                      {ucrData.agency_wide && ucrData.agency_wide.allUcrs && (
                        <ul className="flex justify-between md:justify-start items-center md:gap-6">
                          <li>
                            <button
                              className={`text-xs lg:text-base first-letter:capitalize ${
                                ucrData.agency_wide.selectedUcr === ''
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
                  <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6 pt-12">
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('agencyBar')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {barData.agency_wide && <BarCharts chartData={barData.agency_wide} legendLabel={true} />}
                    </Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('agencyLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {lineAgencyChartData.agency_wide && <LineChats chartData={lineAgencyChartData.agency_wide} />}
                    </Suspense>
                  </div>
                </div>
                <LineChartLegend />
              </div>
            )}
          </main>
        </div>
      </div>
      <CustomModal title={getModalTitle()} isOpen={openModal} onClose={handleCloseModal}>
        {sectionVisibility.agencyBar && barData.agency_wide && <BarCharts chartData={barData.agency_wide} />}
        {sectionVisibility.agencyLine && lineAgencyChartData.agency_wide && <LineChats chartData={lineAgencyChartData.agency_wide} />}
        {sectionVisibility.systemWideBar && barData.systemwide_crime && <BarCharts chartData={barData.systemwide_crime} />}
        {sectionVisibility.systemWideLine && lineChartData.systemwide_crime && <LineChats chartData={lineChartData.systemwide_crime} />}
        {sectionVisibility.violentBar && barData.violent_crime && <BarCharts chartData={barData.violent_crime} />}
        {sectionVisibility.violentLine && lineChartData.violent_crime && <LineChats chartData={lineChartData.violent_crime} />}
      </CustomModal>
    </>
  );
}
SystemWide.propTypes = {
  chartData: PropTypes.array.isRequired,
  legendLabel: PropTypes.string
};
export default SystemWide;
