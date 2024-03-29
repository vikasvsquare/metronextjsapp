'use client';
import { useEffect, useState } from 'react';
import DashboardNav from '@/components/DashboardNav';
import LineChats from '@/components/charts/LineChats';

function Rail() {
  const [routeData, setRouteData] = useState(null);
  const [dateData, setDateData] = useState(null);
  const [ucrData, setUcrData] = useState({});
  const [comments, setComments] = useState({});
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);

  useEffect(() => {
    async function fetchRouteData() {
      try {
        const response = await fetch('http://13.233.193.48:5000/routes/?stat_type=crime&vetted=true&transport_type=rail', {
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
        data.sort();
        setRouteData(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRouteData();
  }, []);

  useEffect(() => {
    async function fetchDates() {
      try {
        const response = await fetch('http://13.233.193.48:5000/crime/date_details?published=true&transport_type=rail&vetted=true', {
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

          data.forEach((date) => {
            const [year, month] = date.split('-');
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
          setDateData(dates);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchDates();
  }, []);

  useEffect(() => {
    async function fetchUCR(severity) {
      try {
        const response = await fetch(`http://13.233.193.48:5000/crime?transport_type=rail&vetted=true&severity=${severity}`, {
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
          setUcrData((prevUcrState) => {
            const newUcrState = { ...prevUcrState };
            newUcrState[severity] = data;

            return newUcrState;
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchUCR('serious_crime');
    fetchUCR('general_crime');
    fetchUCR('agency_wide');
  }, []);

  useEffect(() => {
    async function fetchComments(section) {
      try {
        const response = await fetch('http://13.233.193.48:5000/crime/comment', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: 'A Line (Blue)',
            transport_type: 'rail',
            vetted: true,
            dates: ['2023-11-01'],
            section: section,
            published: true,
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
  }, []);

  function handleDatePickerClick() {
    setIsDatePickerActive((prevDatePickerState) => !prevDatePickerState);
  }

  function cancelPropagation(event) {
    event.stopPropagation();
  }

  return (
    <>
      <DashboardNav />
      <div className="container">
        <div className="lg:flex lg:gap-8">
          <aside className="relative hidden lg:block lg:basis-3/12 pl-6 pt-6 bg-gradient-to-b from-[#050708] from-[-2.29%] to-[#0089E3] to-[90.57%] min-h-screen rounded-tr-3xl">
            <div>
              {/* <div className="relative w-11/12 mr-4 before:inline-block before:w-3.5 before:h-3.5 before:bg-[url('/assets/icon-search.svg')] before:bg-contain before:absolute before:top-1/2 before:-translate-y-1/2 before:left-5">
                <input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search Route"
                  className="w-full bg-transparent text-white border border-solid border-white rounded pl-12 py-2 px-4 placeholder:text-center"
                />
              </div> */}
              <ul className="my-4">
                <li>
                  <button className="bg-white text-blue-700 text-left font-bold rounded-l-2xl py-3 px-4 lg:px-12 xl:px-20 mr-4 w-full">
                    All Lines
                  </button>
                </li>
                {routeData &&
                  routeData.map((route) => (
                    <li key={route}>
                      <button className="bg-transparent text-white text-left font-medium rounded-l-2xl py-3 px-4 lg:px-12 xl:px-20 mr-4 w-full">
                        {route}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
          <main className="lg:grow lg:basis-9/12 pb-7 lg:pb-8 mt-14">
            <div className="flex flex-wrap items-center justify-between mb-5">
              <h2 className="basis-full sm:basis-6/12 text-2xl lg:text-3xl font-scala-sans font-semibold mt-5 lg:mt-0">All Lines</h2>
              <div className="basis-full sm:basis-6/12 -order-1 sm:order-none flex items-center p-2 gap-2 bg-slate-100 rounded-lg">
                <button className="flex-auto bg-white rounded-lg px-4 py-2 flex justify-center items-center bg-gradient-to-r from-[#040E15] from-[5.5%] to-[#17527B] to-[93.69%] text-white">
                  <span>Vetted Data</span>
                </button>
                <button className="flex-auto rounded-lg px-4 py-2 flex justify-center items-center">
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
                    >
                      <span className="flex justify-center items-center min-h-6">Select Date</span>
                      {isDatePickerActive && (
                        <ul className="flex flex-col bg-white rounded-lg px-2.5 pb-4 mt-2" onClick={cancelPropagation}>
                          {dateData &&
                            dateData.map((date) => (
                              <li className="block py-2.5 border-b border-solid border-slate-300" key={date.year}>
                                <label className="flex justify-start text-black px-2.5">
                                  <input type="checkbox" className="mr-5" name={date.year} id={date.year} />
                                  <span>{date.year}</span>
                                  <span></span>
                                </label>
                                {date.months.length && date.active && (
                                  <ul className="flex flex-col bg-sky-100 rounded-lg px-1.5 pb-4 mt-2">
                                    {date.months.map((month) => {
                                      const key = `${month.toLowerCase()}-${date.year}`;

                                      return (
                                        <li className="block p-1.5 border-b border-solid border-slate-300" key={key}>
                                          <label className="flex justify-start text-black px-1.5">
                                            <input type="checkbox" className="mr-3" name={key} id={key} />
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
                      )}
                    </div>
                  </div>
                </div>
                <div className="md:basis-1/12 xl:basis-2/12 hidden md:block xl:flex xl:justify-center xl:items-center">
                  <span className="hidden xl:inline-block xl:w-px xl:h-10 xl:bg-black"></span>
                </div>
                <div className="md:basis-8/12 xl:basis-7/12 mt-5 md:mt-0">
                  <ul className="flex justify-between md:justify-start items-center md:gap-6">
                    <li>
                      <button className="text-xs font-bold">This month</button>
                    </li>
                    <li>
                      <button className="text-xs font-bold">Previous Month</button>
                    </li>
                    <li>
                      <button className="text-xs font-bold">Last Quarter</button>
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
                  {ucrData['serious_crime'] && (
                    <ul className="flex justify-between md:justify-start items-center md:gap-6">
                      <li>
                        <a href="" className="text-xs lg:text-base text-black font-bold">
                          All
                        </a>
                      </li>
                      {ucrData.serious_crime.map((ucr) => {
                        const activeClassname = false ? ' text-black font-bold' : ' text-slate-500';

                        return (
                          <li key={ucr}>
                            <button className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}>{ucr}</button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              {comments.serious_crime && (
                <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.serious_crime}</p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  <h6 className="inline-block text-xxs font-bold border-b border-solid border-sky-400 mb-4">UNDER PERSON CRIME</h6>
                  <div className="flex flex-col gap-5">
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0065A8;] text-xs text-white text-center whitespace-nowrap dark:bg-[#0065A8;] transition duration-500"
                        style={{ width: '50%' }}
                      >
                        50%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0490EB] text-xs text-white text-center whitespace-nowrap dark:bg-[#0490EB] transition duration-500"
                        style={{ width: '25%' }}
                      >
                        25%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#57B7F5] text-xs text-white text-center whitespace-nowrap dark:bg-[#57B7F5] transition duration-500"
                        style={{ width: '20%' }}
                      >
                        20%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#A9DCFD] text-xs text-white text-center whitespace-nowrap dark:bg-[#A9DCFD] transition duration-500"
                        style={{ width: '10%' }}
                      >
                        10%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full" style={{ fontSize: 11, padding: '10px 0' }}>
                  <LineChats />
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
                  {ucrData.general_crime && (
                    <ul className="flex justify-between md:justify-start items-center md:gap-6">
                      <li>
                        <a href="" className="text-xs lg:text-base text-black font-bold">
                          All
                        </a>
                      </li>
                      {ucrData.general_crime.map((ucr) => {
                        const activeClassname = false ? ' text-black font-bold' : ' text-slate-500';

                        return (
                          <li key={ucr}>
                            <button className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}>{ucr}</button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              {comments.general_crime && (
                <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.general_crime}</p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  <h6 className="inline-block text-xxs font-bold border-b border-solid border-sky-400 mb-4">UNDER PERSON CRIME</h6>
                  <div className="flex flex-col gap-5">
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0065A8;] text-xs text-white text-center whitespace-nowrap dark:bg-[#0065A8;] transition duration-500"
                        style={{ width: '50%' }}
                      >
                        50%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0490EB] text-xs text-white text-center whitespace-nowrap dark:bg-[#0490EB] transition duration-500"
                        style={{ width: '25%' }}
                      >
                        25%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#57B7F5] text-xs text-white text-center whitespace-nowrap dark:bg-[#57B7F5] transition duration-500"
                        style={{ width: '20%' }}
                      >
                        20%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#A9DCFD] text-xs text-white text-center whitespace-nowrap dark:bg-[#A9DCFD] transition duration-500"
                        style={{ width: '10%' }}
                      >
                        10%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full" style={{ fontSize: 11, padding: '10px 0' }}>
                  <LineChats />
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
                  {ucrData.agency_wide && (
                    <ul className="flex justify-between md:justify-start items-center md:gap-6">
                      <li>
                        <a href="" className="text-xs lg:text-base text-black font-bold">
                          All
                        </a>
                      </li>
                      {ucrData.agency_wide.map((ucr) => {
                        const activeClassname = false ? ' text-black font-bold' : ' text-slate-500';

                        return (
                          <li key={ucr}>
                            <button className={`text-xs lg:text-base first-letter:capitalize ${activeClassname}`}>{ucr}</button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
              {comments.agency_wide && (
                <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">{comments.agency_wide}</p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-5">
                <div className="bg-white py-4 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  <h6 className="inline-block text-xxs font-bold border-b border-solid border-sky-400 mb-4">UNDER PERSON CRIME</h6>
                  <div className="flex flex-col gap-5">
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0065A8;] text-xs text-white text-center whitespace-nowrap dark:bg-[#0065A8;] transition duration-500"
                        style={{ width: '50%' }}
                      >
                        50%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#0490EB] text-xs text-white text-center whitespace-nowrap dark:bg-[#0490EB] transition duration-500"
                        style={{ width: '25%' }}
                      >
                        25%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#57B7F5] text-xs text-white text-center whitespace-nowrap dark:bg-[#57B7F5] transition duration-500"
                        style={{ width: '20%' }}
                      >
                        20%
                      </div>
                    </div>
                    <p className="text-xxs -mb-4">Agg Assault on Operator</p>
                    <div className="flex w-full h-4 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-200">
                      <div
                        className="flex flex-col justify-center rounded-full overflow-hidden bg-[#A9DCFD] text-xs text-white text-center whitespace-nowrap dark:bg-[#A9DCFD] transition duration-500"
                        style={{ width: '10%' }}
                      >
                        10%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white py-4 px-4 text-slate-400 rounded-lg mt-6 w-full" style={{ fontSize: 11, padding: '10px 0' }}>
                  <LineChats />
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
