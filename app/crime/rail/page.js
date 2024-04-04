'use client';
import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import equal from 'array-equal';
import DashboardNav from '@/components/DashboardNav';
import LineChats from '@/components/charts/LineChats';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import BarCharts from '@/components/charts/BarCharts';
import Loader from '@/components/ui/loader';
import dayjs from 'dayjs';
import SideBar from '@/components/SideBar';
import { fetchAllLines, fetchTimeRange, getUCR } from '@/lib/action';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];

function Rail() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [comments, setComments] = useState({});
  const [dateData, setDateData] = useState([]);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [routeData, setRouteData] = useState([]);
  const [ucrData, setUcrData] = useState({});
  const [vetted, setVetted] = useState(true);

  const searchData = searchParams.get('line');

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  let totalSelectedDates = [];

  if (dateData) {
    dateData?.forEach((dateObj) => {
      if (dateObj.hasOwnProperty('selectedMonths')) {
        totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedMonths];
      }
    });
  }

  document.addEventListener('mousedown', (e) => {
    if (isDatePickerActive && !dateDropdownRef.current?.contains(e.target)) {
      setIsDatePickerActive(false);
    }
  });

  useEffect(() => {
    async function fetchLinesAsync(vetted) {
      const result = await fetchAllLines(vetted);
      setRouteData(result);
    }

    fetchLinesAsync(vetted);

    async function fetchDates(vetted) {
      const result = await fetchTimeRange(vetted);
      setDateData(result.dates);
      thisMonth = result.thisMonth;
      previousMonth = result.previousMonth;
      lastQuarter = result.lastQuarter;
    }

    fetchDates(vetted);

    async function fetchUCR(vetted, severity) {
      const result = await getUCR(vetted, severity);

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

    fetchUCR(vetted, 'serious_crime');
    fetchUCR(vetted, 'general_crime');
    fetchUCR(vetted, 'agency_wide');
  }, [vetted]);

  useEffect(() => {
    if (dateData.length === 0 || Object.keys(ucrData).length === 0 || searchData === '') {
      return;
    }

    async function fetchComments(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}crime/comment`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
            transport_type: 'rail',
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

    fetchComments('serious_crime');
    fetchComments('general_crime');
    fetchComments('agency_wide');

    async function fetchBarChart(section) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_APP_HOST + 'crime/data', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
            transport_type: 'rail',
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
    }

    fetchBarChart('serious_crime');
    fetchBarChart('general_crime');

    async function fetchLineChart(section) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_APP_HOST + 'crime/data', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
            transport_type: 'rail',
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
        const transformedData = data['crime_line_data'].map((item) => {
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
    }

    fetchLineChart('serious_crime');
    fetchLineChart('general_crime');

    async function fetchAgencyWideBarChart(section) {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_APP_HOST + 'crime/data/agency', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
            transport_type: 'rail',
            vetted: vetted,
            dates: totalSelectedDates,
            // severity: section,
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
        const response = await fetch(process.env.NEXT_PUBLIC_APP_HOST + 'crime/data/agency', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : '',
            dates: totalSelectedDates,
            transport_type: 'rail',
            // severity: section,
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
        const transformedData = data['agency_wide_line_data'].map((item) => {
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
  }, [vetted, dateData, ucrData, searchData]);

  function handleVettedToggle(value) {
    setVetted(value);
    router.push(pathName + '?' + createQueryString('line', 'all'));
  }

  function handleDatePickerClick() {
    setIsDatePickerActive((prevDatePickerState) => {
      return !prevDatePickerState;
    });
  }

  function handleYearClick(year, shouldOpen) {
    setDateData((prevDateData) => {
      const newDateData = [...prevDateData];
      const yearIndex = newDateData.findIndex((obj) => obj.year === year);

      newDateData[yearIndex].active = shouldOpen;
      return newDateData;
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
            dateObj.selectedMonths = [...dates];
          }
        });

        return newDateData;
      });
    } else {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            dateObj.selectedMonths = [];
          }
        });

        return newDateData;
      });
    }
  }

  function handleMonthCheckboxClick(e, date) {
    const year = date.split('-')[0];

    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (!dateObj.hasOwnProperty('selectedMonths')) {
              dateObj.selectedMonths = [];
            }

            if (dateObj.selectedMonths.indexOf(date) === -1) {
              dateObj.selectedMonths.push(date);
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
            if (dateObj.hasOwnProperty('selectedMonths')) {
              if (dateObj.selectedMonths.indexOf(date) > -1) {
                dateObj.selectedMonths.splice(dateObj.selectedMonths.indexOf(date), 1);
              }
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleCrimeCategoryChange(severity, crimeCategory) {
    setUcrData((prevUcrState) => {
      const newUcrState = { ...prevUcrState };
      newUcrState[severity].selectedUcr = crimeCategory;
      return newUcrState;
    });
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

  return (
    <>
      <DashboardNav />
      <div className="container relative z-10">
        <div className="lg:flex lg:gap-8">
          <SideBar searchData={searchData} routeData={routeData} createQueryString={createQueryString} />
          <main className="lg:grow lg:basis-9/12 pb-7 lg:pb-8 mt-14">
            <div className="flex flex-wrap items-center justify-between mb-5">
              <h2 className="basis-full sm:basis-6/12 text-2xl lg:text-3xl font-scala-sans font-semibold mt-5 lg:mt-0">All Lines</h2>
              <div className="basis-full sm:basis-6/12 -order-1 sm:order-none flex items-center p-2 gap-2 bg-slate-100 rounded-lg">
                <button
                  className={`flex-auto rounded-lg px-4 py-2 flex justify-center items-center ${vetted ? 'bg-gradient-to-r from-[#040E15] from-[5.5%] to-[#17527B] to-[93.69%] text-white' : 'bg-white'
                    }`}
                  onClick={() => handleVettedToggle(true)}
                >
                  <span>Vetted Data</span>
                </button>
                <button
                  className={`flex-auto rounded-lg px-4 py-2 flex justify-center items-center ${!vetted ? 'bg-gradient-to-r from-[#040E15] from-[5.5%] to-[#17527B] to-[93.69%] text-white' : 'bg-white'
                    }`}
                  onClick={() => handleVettedToggle(false)}
                >
                  <span>Unvetted Data</span>
                </button>
              </div>
            </div>
            {/* <p className="text-sm lg:text-base text-slate-500 mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            </p> */}
            <div className="relative z-30">
              <h5 className="text-lg text-slate-400 mb-4">Select Time Range</h5>
              <div className="md:flex md:items-center py-2 px-5 rounded-xl bg-gradient-to-r from-[#EAF7FF] from-[0%] to-[#ADDFFF] to-[106.61%]">
                <div className="md:basis-3/12">
                  <div className="relative min-h-11">
                    <div
                      className="absolute w-full h-auto top-0 left-0 p-2.5 flex-auto rounded-lg bg-[#032A43] text-white"
                      onClick={handleDatePickerClick}
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
                            className={`w-full h-full${isDatePickerActive ? ' rotate-180' : ''}`}
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
                          className={`${isDatePickerActive ? 'flex' : 'hidden'
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
                                    checked={date.selectedMonths && date.selectedMonths.length === date.months.length}
                                    onChange={(e) => handleYearCheckboxClick(e, date.year, date.months)}
                                  />
                                  <span className="basis-8/12 flex-grow text-center">{date.year}</span>
                                  <span className="basis-2/12 flex items-center ">
                                    <button className="inline-block h-5 w-5" onClick={() => handleYearClick(date.year, !date.active)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                        className={`w-full h-full${date.active ? ' rotate-180' : ''}`}
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
                                  <ul className={`${date.active ? 'flex' : 'hidden'} flex-col bg-sky-100 rounded-lg px-1.5 pb-4 mt-2`}>
                                    {date.months.map((month) => {
                                      const monthIndex = monthNames.indexOf(month) + 1;
                                      const key = `${date.year}-${monthIndex}-1`;

                                      return (
                                        <li className="block p-1.5 border-b border-solid border-slate-300" key={key}>
                                          <label className="flex justify-start text-black px-1.5">
                                            <input
                                              type="checkbox"
                                              className="mr-3"
                                              name={key}
                                              id={key}
                                              checked={date.selectedMonths && date.selectedMonths.indexOf(key) > -1}
                                              onChange={(e) => handleMonthCheckboxClick(e, key)}
                                            />
                                            <span>{month}</span>
                                            <span></span>
                                          </label>
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
                  <ul className="flex justify-between md:justify-start items-center md:gap-6">
                    <li>
                      <button
                        className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(thisMonth, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                        onClick={() => handleMonthFilterClick(thisMonth)}
                      >
                        This month
                      </button>
                    </li>
                    <li>
                      <button
                        className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(previousMonth, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                        onClick={() => handleMonthFilterClick(previousMonth)}
                      >
                        Previous Month
                      </button>
                    </li>
                    <li>
                      <button
                        className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(lastQuarter, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                          }`}
                        onClick={() => handleMonthFilterClick(lastQuarter)}
                      >
                        Last Quarter
                      </button>
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
            <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
              <div className="flex flex-wrap items-center">
                <div className="basis-10/12 xl:basis-4/12">
                  <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                    Serious Crime
                  </h2>
                </div>
                {/* <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                  <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                </div> */}
                <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0">
                  <Suspense fallback={<Loader />}>
                    {ucrData.serious_crime && ucrData.serious_crime.allUcrs && (
                      <ul className="flex justify-between md:justify-start items-center md:gap-6">
                        <li>
                          <button
                            className={`text-xs lg:text-base first-letter:capitalize ${ucrData.serious_crime.selectedUcr === ''
                              ? 'text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                              : 'text-slate-500'
                              }`}
                            onClick={() => handleCrimeCategoryChange('serious_crime', '')}
                          >
                            All
                          </button>
                        </li>
                        {ucrData.serious_crime.allUcrs.map((ucr) => {
                          const activeClassname =
                            ucrData.serious_crime.selectedUcr === ucr
                              ? ' text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                              : ' text-slate-500';

                          return (
                            <li key={ucr}>
                              <button
                                className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}
                                onClick={() => handleCrimeCategoryChange('serious_crime', ucr)}
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
                {comments.serious_crime && (
                  <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.serious_crime}</p>
                )}
              </Suspense>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  {/* <h6 className="inline-block text-xxs font-bold border-b border-solid border-sky-400 mb-4">UNDER PERSON CRIME</h6> */}
                  <Suspense fallback={<Loader />}>{barData.serious_crime && <BarCharts chartData={barData.serious_crime} />}</Suspense>
                </div>
                <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full" style={{ fontSize: 11, padding: '10px 0' }}>
                  <Suspense fallback={<Loader />}>
                    {lineChartData.serious_crime && <LineChats chartData={lineChartData.serious_crime} />}
                  </Suspense>
                </div>
              </div>
            </div>
            <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
              <div className="flex flex-wrap items-center">
                <div className="basis-10/12 xl:basis-4/12">
                  <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                    General Crime
                  </h2>
                </div>
                {/* <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                  <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                </div> */}
                <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0">
                  <Suspense fallback={<Loader />}>
                    {ucrData.general_crime && ucrData.general_crime.allUcrs && (
                      <ul className="flex justify-between md:justify-start items-center md:gap-6">
                        <li>
                          <button
                            className={`text-xs lg:text-base first-letter:capitalize ${ucrData.general_crime.selectedUcr === ''
                              ? 'text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                              : 'text-slate-500'
                              }`}
                            onClick={() => handleCrimeCategoryChange('general_crime', '')}
                          >
                            All
                          </button>
                        </li>
                        {ucrData.general_crime.allUcrs.map((ucr) => {
                          const activeClassname =
                            ucrData.general_crime.selectedUcr === ucr
                              ? ' text-black font-bold relative after:absolute after:-bottom-1 after:left-0 after:right-0 after:mx-auto after:w-4/5 after:h-px after:bg-black'
                              : ' text-slate-500';

                          return (
                            <li key={ucr}>
                              <button
                                className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}
                                onClick={() => handleCrimeCategoryChange('general_crime', ucr)}
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
                {comments.general_crime && (
                  <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.general_crime}</p>
                )}
              </Suspense>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  {/* <h6 className="inline-block text-xxs font-bold border-b border-solid border-sky-400 mb-4">UNDER PERSON CRIME</h6> */}
                  <Suspense fallback={<Loader />}>{barData.general_crime && <BarCharts chartData={barData.general_crime} />}</Suspense>
                </div>
                <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full" style={{ fontSize: 11, padding: '10px 0' }}>
                  <Suspense fallback={<Loader />}>
                    {lineChartData.general_crime && <LineChats chartData={lineChartData.general_crime} />}
                  </Suspense>
                </div>
              </div>
            </div>
            <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
              <div className="flex flex-wrap items-center">
                <div className="basis-10/12 xl:basis-4/12">
                  <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                    Agency Wide Analysis
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
                <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  {/* <h6 className="inline-block text-xxs font-bold border-b border-solid border-sky-400 mb-4">UNDER PERSON CRIME</h6> */}
                  <Suspense fallback={<Loader />}>{barData.agency_wide && <BarCharts chartData={barData.agency_wide} />}</Suspense>
                </div>
                <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full" style={{ fontSize: 11, padding: '10px 0' }}>
                  <Suspense fallback={<Loader />}>
                    {lineAgencyChartData.agency_wide && <LineChats chartData={lineAgencyChartData.agency_wide} />}
                  </Suspense>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Rail;
