'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchAllLines, fetchTimeRange } from '@/lib/action';

import ApexLineChart from '@/components/charts/ApexLineChart';
import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import LineChats from '@/components/charts/LineChats';
import Loader from '@/components/ui/loader';
// import SideBar from '@/components/SideBar';
import LineChartLegend from '@/components/ui/LineChartLegend';
import ReactApexchartLine from '@/components/charts/ReactApexchartLine';
import ReactApexchartBar2 from '@/components/charts/ReactApexchartBar2';
import ReactApexchart from '@/components/charts/ReactApexchart';
import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

const STAT_TYPE = 'call_for_service';
const TRANSPORT_TYPE = 'bus';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];

function Bus() {
  const pathName = usePathname();
  const router = useRouter();
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
  const [ucrData, setUcrData] = useState({});
  const [published, setPublished] = useState(true);
  const [sectionVisibility, setSectionVisibility] = useState({
    callsClassificationBar: false,
    callsClassificationLine: false,
    agencywideAnalysisBar: false,
    agencywideAnalysisLine: false
  });

  const searchData = searchParams.get('line');
  const publishType = searchParams.get('published');

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
  if (thisMonth.length) {
    latestDate = dayjs(thisMonth).format('MMMM YYYY');
    localStorage.setItem('latestDate', latestDate);
  }

  if (dateData) {
    dateData?.forEach((dateObj) => {
      if (dateObj.hasOwnProperty('selectedMonths')) {
        totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedMonths];
      }
    });
  }

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

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
      const result = await fetchTimeRange(STAT_TYPE, TRANSPORT_TYPE, published);

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
            published: published
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

    // fetchComments('calls_classification');
    // fetchComments('agency_wide');

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
            published: published,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['call_for_service_line_data'] &&
          data['call_for_service_line_data']
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
            published: published,
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
      return 'Law Enforcement Analysis';
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
                            className={`${isDateDropdownOpen ? 'flex' : 'hidden'
                              } flex-col bg-white rounded-lg px-2.5 pb-4 max-h-80 overflow-y-scroll mt-2 border-2`}
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

                  <div className="md:basis-8/12 xl:basis-7/12 md:mt-0">
                    <ul className="select-date-ribbon sm:mb-0 md:gap-6">
                      <li>
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(thisMonth, totalSelectedDates) ? 'current-days-active' : 'current-days-inactive'
                            }`}
                          onClick={() => handleMonthFilterClick(thisMonth)}
                        >
                          <div className='flex flex-col items-center justify-center'>
                            Current Month
                            <span className='text-capitalize text-sm'>{`(${dayjs(thisMonth).format('MMM YY')})`}</span>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(previousMonth, totalSelectedDates) ? 'current-days-active' : 'current-days-inactive'
                            }`}
                          onClick={() => handleMonthFilterClick(previousMonth)}
                        >
                          <div className='flex flex-col items-center justify-center'>
                            Last Two Months
                            <span className='text-capitalize text-sm'>{`(${dayjs(previousMonth[1]).format('MMM YY')} - ${dayjs(previousMonth[0]).format('MMM YY')})`}</span>
                          </div>
                        </button>
                      </li>
                      <li>
                        <button
                          className={`text-xs font-bold py-1 px-2 lg:py-3 lg:px-4 rounded-lg ${equal(lastQuarter, totalSelectedDates) ? 'current-days-active' : 'current-days-inactive'
                            }`}
                          onClick={() => handleMonthFilterClick(lastQuarter)}
                        >
                          <div className='flex flex-col items-center justify-center'>
                            Last Quarter
                            <span className='text-capitalize text-sm'>{`(${dayjs(lastQuarter[2]).format('MMM YY')} - ${dayjs(lastQuarter[0]).format('MMM YY')})`}</span>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3 metro__main-title mt-3">Calls Classification </h5>
        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div class="w-100 mt-4 bg-white metro__section-card">
            {barData.calls_classification && <ReactApexchartBar2 chartData1={barData.calls_classification} />}
          </div>
        </div>
        <div className='col-md-8'>
          <div class="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            {lineChartData.calls_classification && <ReactApexchartLine chartData1={lineChartData.calls_classification} height={405} />}
          </div>
        </div>
      </div>


      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3 metro__main-title mt-3">Law Enforcement Analysis </h5>
        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div class="w-100 mt-4 bg-white metro__section-card">
            <Suspense fallback={<Loader />}>{barData.agency_wide && <ReactApexchartBar2 chartData1={barData.agency_wide} height={373}/>}</Suspense>
          </div>
        </div>
        <div className='col-md-8'>
          <div class="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            {lineAgencyChartData.agency_wide && <ReactApexchartLine chartData1={lineAgencyChartData.agency_wide} height={405} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bus;
