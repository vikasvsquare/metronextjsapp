'use client';
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchAllLines, fetchTimeRange } from '@/lib/action';
import { Sidebar_data } from '@/store/context';

import DashboardNav from '@/components/DashboardNav';
import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import LineChats from '@/components/charts/LineChats';
import Loader from '@/components/ui/loader';
import SideBar from '@/components/SideBar';
import LineChartLegend from '@/components/ui/LineChartLegend';

const STAT_TYPE = 'call_for_service';
const TRANSPORT_TYPE = 'rail';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];

function Rail() {
  const { setSideBarData } = useContext(Sidebar_data);
  const searchParams = useSearchParams();

  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [comments, setComments] = useState({});
  const [dateData, setDateData] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [sectionVisibility, setSectionVisibility] = useState({
    callsClassificationBar: false,
    callsClassificationLine: false,
    agencywideAnalysisBar: false,
    agencywideAnalysisLine: false
  });

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
      const result = await fetchTimeRange(STAT_TYPE, TRANSPORT_TYPE);

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

      thisMonth = result.thisMonth;
      previousMonth = result.previousMonth;
      lastQuarter = result.lastQuarter;
    }

    fetchDates();
  }, []);

  useEffect(() => {
    if (dateData.length === 0 || searchData === '') {
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
            line_name: searchData !== 'all' ? searchData : '',
            transport_type: TRANSPORT_TYPE,
            dates: totalSelectedDates,
            section: section,
            published: true
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

    fetchComments('calls_classification');
    fetchComments('agency_wide');

    async function fetchBarChart(section) {
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
            dates: totalSelectedDates,
            severity: section,
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
          newBarChartState[section] = data['call_for_service_bar_data'];

          return newBarChartState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchBarChart('calls_classification');

    async function fetchLineChart(section) {
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
            dates: totalSelectedDates,
            severity: section,
            published: true,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['call_for_service_line_data'] &&
          data['call_for_service_line_data'].map((item) => {
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

    fetchLineChart('calls_classification');

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
            dates: totalSelectedDates,
            // severity: section,
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
          newBarChartState[section] = data['call_for_service_agency_wide_bar'];

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
            line_name: searchData !== 'all' ? searchData : '',
            dates: totalSelectedDates,
            transport_type: TRANSPORT_TYPE,
            published: true,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['call_for_service_agency_wide_line'] &&
          data['call_for_service_agency_wide_line'].map((item) => {
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
  }, [dateData, searchData]);

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
      callsClassificationBar: false,
      callsClassificationLine: false,
      agencywideAnalysisBar: false,
      agencywideAnalysisLine: false
    });
  }

  function getModalTitle() {
    if (sectionVisibility.callsClassificationBar || sectionVisibility.callsClassificationLine) {
      return 'Calls Classification';
    } else if (sectionVisibility.agencywideAnalysisBar || sectionVisibility.agencywideAnalysisLine) {
      return 'Agencywide Analysis';
    } else {
      return '';
    }
  }

  return (
    <>
      <div className="sidebar-content ">
        <div className="container relative z-10">
          <div className="lg:flex lg:gap-8">
            <main className="lg:grow lg:basis-9/12 pb-7 lg:pb-8">
            <div className="relative z-30">
                <div className="bg-white md:flex md:items-center p-2 rounded-xl marginTop-93">
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
                            className={`${isDateDropdownOpen ? 'flex' : 'hidden'
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
                                      {date.months.map((month) => {
                                        const monthIndex = MONTH_NAMES.indexOf(month) + 1;
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
                  <div className="md:basis-8/12 xl:basis-7/12 md:mt-0">
                    <ul className="flex justify-between md:justify-start items-center mb-4 sm:mb-0 md:gap-6">
                      <li>
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(thisMonth, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                            }`}
                          onClick={() => handleMonthFilterClick(thisMonth)}
                        >
                          Current month
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(previousMonth, totalSelectedDates) ? 'bg-white' : 'bg-transparent'
                            }`}
                          onClick={() => handleMonthFilterClick(previousMonth)}
                        >
                          Last Two Months
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
                      Calls Classification
                    </h2>
                  </div>
                  {/* <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                  <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                </div> */}
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0"></div>
                </div>
                <Suspense fallback={<Loader />}>
                  {comments.calls_classification && (
                    <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.calls_classification}</p>
                  )}
                </Suspense>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                  <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6 pt-12">
                    <Image
                      alt="Click to zoom chart"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('callsClassificationBar')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {barData.calls_classification && <BarCharts chartData={barData.calls_classification} />}
                    </Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Click to zoom chart"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('callsClassificationLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {lineChartData.calls_classification && <LineChats chartData={lineChartData.calls_classification} />}
                    </Suspense>
                  </div>
                </div>
              </div>
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
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0"></div>
                </div>
                <Suspense fallback={<Loader />}>
                  {comments.agency_wide && (
                    <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.agency_wide}</p>
                  )}
                </Suspense>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                  <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6 pt-12">
                    <Image
                      alt="Click to zoom chart"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('agencywideAnalysisBar')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>{barData.agency_wide && <BarCharts chartData={barData.agency_wide} />}</Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Click to zoom chart"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('agencywideAnalysisLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>
                      {lineAgencyChartData.agency_wide && <LineChats chartData={lineAgencyChartData.agency_wide} />}
                    </Suspense>
                  </div>
                </div>
                <LineChartLegend />
              </div>
            </main>
          </div>
        </div>
        <CustomModal title={getModalTitle()} isOpen={openModal} onClose={handleCloseModal}>
          {sectionVisibility.callsClassificationBar && barData.calls_classification && <BarCharts chartData={barData.calls_classification} />}
          {sectionVisibility.callsClassificationLine && lineChartData.calls_classification && <LineChats chartData={lineChartData.calls_classification} />}
          {sectionVisibility.agencywideAnalysisBar && barData.agency_wide && (
            <BarCharts chartData={barData.agency_wide} />
          )}
          {sectionVisibility.agencywideAnalysisLine && lineAgencyChartData.agency_wide && <LineChats chartData={lineAgencyChartData.agency_wide} />}
        </CustomModal>
      </div>
    </>
  );
}

export default Rail;
