import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Loader from './ui/loader';
import { fetchTimeRange, fetchUnvettedTimeRange, getUCR } from '@/lib/action';
import equal from 'array-equal';
const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'rail';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SelectCustomDate({ vetted = false, stat_type, transport_type, published = true, setTotalSelectedDates2 }) {
    const [dateData, setDateData] = useState([]);
    const [dates, setDates] = useState([]);
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

                newDateData?.forEach((dateObj) => {
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

                newDateData?.forEach((dateObj) => {
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

                newDateData?.forEach((dateObj) => {
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

                newDateData?.forEach((dateObj) => {
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

                newDateData?.forEach((dateObj) => {
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

                newDateData?.forEach((dateObj) => {
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
            if (vetted) {
                //for getting monthly data
                const result = await fetchTimeRange(stat_type, transport_type, published, vetted);
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

                        updatedData?.dates?.forEach((dateObj) => {
                            newIsYearDropdownOpen[dateObj.year] = {
                                active: false
                            };
                        });

                        return newIsYearDropdownOpen;
                    });
                }

            } else {
                //for getting weekly data
                const result = await fetchUnvettedTimeRange(transport_type, published);
                if (result) {
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

                        updatedData?.dates?.forEach((dateObj) => {
                            newIsYearDropdownOpen[dateObj.year] = {
                                active: false
                            };
                        });

                        return newIsYearDropdownOpen;
                    });
                    setIsMonthDropdownOpen(() => {
                        const newIsMonthDropdownOpen = {};

                        updatedData?.dates?.forEach((dateObj) => {
                            dateObj.months?.forEach((month) => {
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
    }, [vetted]);

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
        if (totalSelectedDates1) {
            setTotalSelectedDates2(totalSelectedDates1);
        }
    }, [totalSelectedDates1])


    return (
        <>
            <div className="d-flex flex-column gap-2" style={{ width: 240 }}>
                <p className="mb-1 metro__dropdown-label">Select Date</p>
                <div className="md:basis-3/12">
                    <div className="relative">
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
                                <div className="flex gap-3 items-center" style={{ width: 237, justifyContent: 'space-between' }}>
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
                    </div>
                </div>
            </div>
        </>
    )
}
