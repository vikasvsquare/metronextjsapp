import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Loader from './ui/loader';
import { fetchTimeRange, fetchUnvettedTimeRange, getUCR } from '@/lib/action';
import equal from 'array-equal';
const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SelectDate({ vetted, header, label, frequency, setDates, published }) {
    const [dateData, setDateData] = useState([]);
    const dateDropdownRef = useRef(null);
    // const [published, setPublished] = useState(true);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState([]);
    const [totalSelectedDates1, setTotalSelectedDates] = useState([]);

    function handleDateDropdownClick() {
        setIsDateDropdownOpen((prevDatePickerState) => {
            return !prevDatePickerState;
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
        console.log(date)
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

    useEffect(() => {
        async function fetchDates() {
            if (frequency === 'Monthly') {
                //for getting monthly data
                const result = await fetchTimeRange(header.toLowerCase(), label.toLowerCase(), published, true);
                // console.log(result);
                if (result) {
                    const updatedData = {
                        ...result,
                        dates: result.dates.map(dateObj => ({
                            ...dateObj,
                            selectedMonths: [] // Update selectedMonths with an empty array
                        }))
                    };
                    setIsDateDropdownOpen(false);
                    setDateData(updatedData?.dates);
                    setIsYearDropdownOpen(() => {
                        const newIsYearDropdownOpen = {};

                        updatedData?.dates.forEach((dateObj) => {
                            newIsYearDropdownOpen[dateObj.year] = {
                                active: false
                            };
                        });

                        return newIsYearDropdownOpen;
                    });
                }

            } else {
                //for getting weekly data
                const result = await fetchUnvettedTimeRange(label.toLowerCase(), published);
                if(result){
                    const updatedData = {
                        ...result,
                        dates: result.dates.map(dateObj => ({
                            ...dateObj,
                            selectedWeeks: [] // Update selectedMonths with an empty array
                        }))
                    };
                    setIsDateDropdownOpen(false);
                    setDateData(updatedData?.dates);
                    setIsYearDropdownOpen(() => {
                        const newIsYearDropdownOpen = {};
    
                        updatedData?.dates.forEach((dateObj) => {
                            newIsYearDropdownOpen[dateObj.year] = {
                                active: false
                            };
                        });
    
                        return newIsYearDropdownOpen;
                    });
                    setIsMonthDropdownOpen(() => {
                        const newIsMonthDropdownOpen = {};
    
                        updatedData?.dates.forEach((dateObj) => {
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
                }

            }
        }

        fetchDates();
    }, [frequency]);

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
        if (dateData) {
            let totalSelectedDates = [];
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
      if(totalSelectedDates1){
        setDates(totalSelectedDates1);
      }
    }, [totalSelectedDates1])
    


    return (
        <div className="md:basis-3/12 select-dateWrapper">
            <div className="relative min-h-11">
                <div
                    className="absolute bg-white border-end flex-auto h-auto left-0 p-2.5 rounded-0 rounded-lg subTopNav-selectDate top-0 w-full border-white"
                    onClick={handleDateDropdownClick}
                    ref={dateDropdownRef}
                >
                    <div className="select-date-label flex justify-center items-center min-h-6">
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
                                } flex-col bg-white rounded-lg px-2.5 pb-4 max-h-80 overflow-y-scroll mt-2 border-2 z-[999] relative`}
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
            </div>
        </div>
    )
}