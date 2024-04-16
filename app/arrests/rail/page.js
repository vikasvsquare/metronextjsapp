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
import PieCharts from '@/components/charts/PieCharts';
import SideBar from '@/components/SideBar';
import GeoMapTabs from '@/components/GeoMapTabs';

const STAT_TYPE = 'arrest';
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
  const [pieData, setPieData] = useState({});
  const [sectionVisibility, setSectionVisibility] = useState({
    femaleCategoryPie: false,
    femaleCategoryLine: false,
    maleCategoryPie: false,
    maleCategoryLine: false,
    agencywideAnalysisBar: false,
    agencywideAnalysisLine: false
  });
  const [routeData, setRouteData] = useState([]);

  const searchData = searchParams.get('line');
  const mapType = searchParams.get('type');

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
    async function fetchLinesAsync() {
      const result = await fetchAllLines(STAT_TYPE, TRANSPORT_TYPE);
      setRouteData(result);
      setSideBarData(result);
    }

    fetchLinesAsync();

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

    fetchComments('female_category');
    fetchComments('male_category');
    fetchComments('agency_wide');

    async function fetchPieChart(gender) {
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
            gender: gender,
            dates: totalSelectedDates,
            published: true,
            graph_type: 'pie'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        setPieData((prevPieData) => {
          const newPieDataState = { ...prevPieData };
          newPieDataState[gender] = data['arrest_pie_data'];

          return newPieDataState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchPieChart('female');
    fetchPieChart('male');

    async function fetchLineChart(gender) {
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
            gender: gender,
            dates: totalSelectedDates,
            published: true,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['arrest_line_data'] &&
          data['arrest_line_data'].map((item) => {
            return {
              ...item,
              name: dayjs(item.name).format('MMM YY')
            };
          });

        setLineChartData((prevLineState) => {
          const newLineChartState = { ...prevLineState };
          newLineChartState[gender] = transformedData;

          return newLineChartState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchLineChart('female');
    fetchLineChart('male');

    async function fetchAgencyWideBarChart() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: searchData !== 'all' ? searchData : 'all',
            transport_type: TRANSPORT_TYPE,
            dates: totalSelectedDates,
            published: true,
            graph_type: 'bar'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();

        setBarData((prevBarDataState) => {
          const newBarDataState = { ...prevBarDataState };
          newBarDataState['arrest_agency_wide_bar'] = data['arrest_agency_wide_bar'];

          return newBarDataState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchAgencyWideBarChart();

    async function fetchAgencyWideLineChart(gender) {
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
          data['arrest_agency_wide_line'] &&
          data['arrest_agency_wide_line'].map((item) => {
            return {
              ...item,
              name: dayjs(item.name).format('MMM YY')
            };
          });

        setLineAgencyChartData((prevLineState) => {
          const newLineChartState = { ...prevLineState };
          newLineChartState[gender] = transformedData;

          return newLineChartState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    fetchAgencyWideLineChart('female');
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
      femaleCategoryPie: false,
      femaleCategoryLine: false,
      maleCategoryPie: false,
      maleCategoryLine: false,
      agencywideAnalysisBar: false,
      agencywideAnalysisLine: false
    });
  }

  function getModalTitle() {
    if (sectionVisibility.femaleCategoryPie || sectionVisibility.femaleCategoryLine) {
      return 'Female Category';
    } else if (sectionVisibility.maleCategoryPie || sectionVisibility.maleCategoryLine) {
      return 'Male Category';
    } else if (sectionVisibility.agencywideAnalysisBar || sectionVisibility.agencywideAnalysisLine) {
      return 'Agencywide Analysis';
    } else {
      return '';
    }
  }

  return (
    <>
      <DashboardNav />
      <div className="container relative z-10">
        <div className="lg:flex lg:gap-8">
          {mapType !== 'geomap' && <SideBar searchData={searchData} routeData={routeData} createQueryString={createQueryString} />}
          <main className="lg:grow lg:basis-9/12 pb-7 lg:pb-8 mt-14">
            <div className="flex flex-wrap items-center justify-between mb-8">
              <h2 className="basis-full sm:basis-6/12 text-2xl lg:text-3xl font-scala-sans font-semibold mt-5 lg:mt-0">All Lines</h2>
            </div>
            <div className="relative z-30">
              {mapType !== 'geomap' && (<>
                <div className="flex flex-wrap items-center mb-1 sm:mb-4">
                  <h5 className="basis-1/2 text-lg text-slate-400">Select Time Range</h5>
                  <h6 className="text-sm xl:text-lg italic text-slate-500 w-max ml-auto mt-4 sm:mt-0">
                    {dayjs(thisMonth).format('MMMM YYYY')}
                  </h6>
                </div>
              </>)}
              <div className="md:flex md:items-center py-2 px-5 rounded-xl bg-gradient-to-r from-[#EAF7FF] from-[0%] to-[#ADDFFF] to-[106.61%]">

                <div className="md:basis-3/12">
                  <div className="relative min-h-11">
                    {mapType !== 'geomap' && (<>
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
                    </>)}
                  </div>
                </div>
                <div className="md:basis-1/12 xl:basis-2/12 hidden md:block xl:flex xl:justify-center xl:items-center">
                  {mapType !== 'geomap' && (<>
                    <span className="hidden xl:inline-block xl:w-px xl:h-10 xl:bg-black"></span>
                  </>)}
                </div>
                <div className="md:basis-8/12 xl:basis-7/12 mt-5 md:mt-0">
                  {mapType !== 'geomap' && (<>
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
                  </>)}
                </div>
                <GeoMapTabs mapType={mapType} routeData={routeData} createQueryString={createQueryString} />
              </div>
            </div>

            <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
              {mapType !== 'geomap' && (<>
                <div className="flex flex-wrap items-center">
                  <div className="basis-10/12 xl:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                      Female Category
                    </h2>
                  </div>
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0"></div>
                </div>
                <Suspense fallback={<Loader />}>
                  {comments.female_category && (
                    <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.female_category}</p>
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
                      onClick={() => handleOpenModal('femaleCategoryPie')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>{pieData.female && <PieCharts chartData={pieData.female} female={true} />}</Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Click to zoom chart"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('femaleCategoryLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>{lineChartData.female && <LineChats chartData={lineChartData.female} />}</Suspense>
                  </div>
                </div>
              </>)}
              {mapType === 'geomap' && (<><iframe title="Map" style={{ width: '100%', height: '800px' }}
                src="https://app.powerbi.com/view?r=eyJrIjoiZDMwZjBkZWItMTgxMi00NGFiLTgwZjEtYzJjY2Q1ZWUzOWRlIiwidCI6IjI3YzFlNWI3LTc3M2ItNDQxZS05YTg0LTZlYmFmNDZlZGViNiIsImMiOjl9"
                frameborder="0" allowFullScreen="true"></iframe></>)}
            </div>


            {mapType !== 'geomap' && (<>
              <div className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-14 mt-10 rounded-2xl">
                <div className="flex flex-wrap items-center">
                  <div className="basis-10/12 xl:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                      Male Category
                    </h2>
                  </div>
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0"></div>
                </div>
                <Suspense fallback={<Loader />}>
                  {comments.male_category && (
                    <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.male_category}</p>
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
                      onClick={() => handleOpenModal('maleCategoryPie')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>{pieData.male && <PieCharts chartData={pieData.male} />}</Suspense>
                  </div>
                  <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full pt-12" style={{ fontSize: 11 }}>
                    <Image
                      alt="Click to zoom chart"
                      src="/assets/zoom.svg"
                      width={16}
                      height={16}
                      priority
                      onClick={() => handleOpenModal('maleCategoryLine')}
                      style={{ textAlign: 'right', float: 'right', marginTop: '-2rem', cursor: 'pointer' }}
                    />
                    <Suspense fallback={<Loader />}>{lineChartData.male && <LineChats chartData={lineChartData.male} />}</Suspense>
                  </div>
                </div>
              </div>
            </>)}

            {mapType !== 'geomap' && (<>
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
                    <Suspense fallback={<Loader />}>
                      {barData.arrest_agency_wide_bar && <BarCharts chartData={barData.arrest_agency_wide_bar} />}
                    </Suspense>
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
                      {lineAgencyChartData.female && <LineChats chartData={lineAgencyChartData.female} />}
                    </Suspense>
                  </div>
                </div>
                <div>
                  <ul className='flex justify-around items-center text-sm pt-4 text-center'>
                    <li><span className='font-bold'>LAPD:</span> Los Angeles Police Department</li>
                    <li><span className='font-bold'>LASD: </span>Los Angeles County Sheriff's Department</li>
                    <li><span className='font-bold'>LBPD: </span>Long Beach Police Department</li>
                  </ul>
                </div>
              </div>
            </>)}

          </main>
        </div>
      </div>
      <CustomModal title={getModalTitle()} isOpen={openModal} onClose={handleCloseModal}>
        {sectionVisibility.femaleCategoryPie && pieData.female && <PieCharts chartData={pieData.female} />}
        {sectionVisibility.femaleCategoryLine && lineChartData.female && <LineChats chartData={lineChartData.female} />}
        {sectionVisibility.maleCategoryPie && pieData.male && <PieCharts chartData={pieData.male} />}
        {sectionVisibility.maleCategoryLine && lineChartData.male && <LineChats chartData={lineChartData.male} />}
        {sectionVisibility.agencywideAnalysisBar && barData.arrest_agency_wide_bar && (
          <BarCharts chartData={barData.arrest_agency_wide_bar} />
        )}
        {sectionVisibility.agencywideAnalysisLine && lineAgencyChartData.female && <LineChats chartData={lineAgencyChartData.female} />}
      </CustomModal>
    </>
  );
}

export default Rail;
