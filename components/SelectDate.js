import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Loader from './ui/loader';

export default function SelectDate({ mapType, vetted, handleDateDropdownClick, dateDropdownRef, isDateDropdownOpen, dateData, handleYearCheckboxClick, handleYearDropdownClick,
    isYearDropdownOpen, MONTH_NAMES, handleMonthCheckboxClick, handleMonthDropdownClick, handleWeekCheckboxClick }) {
    return (
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
    )
}

{/* <SelectDate mapType={mapType} vetted={vetted} handleDateDropdownClick={handleDateDropdownClick} dateDropdownRef={dateDropdownRef}
                      isDateDropdownOpen={isDateDropdownOpen}
                      dateData={dateData} handleYearCheckboxClick={handleYearCheckboxClick} handleYearDropdownClick={handleYearDropdownClick}
                      isYearDropdownOpen={isYearDropdownOpen}
                      MONTH_NAMES={MONTH_NAMES} handleMonthCheckboxClick={handleMonthCheckboxClick}
                      handleMonthDropdownClick={handleMonthDropdownClick} handleWeekCheckboxClick={handleWeekCheckboxClick} /> */}