'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';
import Image from 'next/image';
import MonthlyWeeklyToggle from './MonthlyWeeklyToggle';
import dayjs from 'dayjs';

function DashboardCardsListMix({label, labelValue, dateValue}) {

  return (
    <>
      <div className="metro-custom_card-wrapper metro__crime-card metro__mix text-white">
            <div className="card-body d-flex flex-column justify-content-between h-100">

              {/* <!-- Top Section: Title & Date --> */}
              <div className="card-wrapper">
                <div className="align-items-center d-flex justify-content-between w-100">
                  <div className="metro__crime-card-label">
                    {label}
                  </div>
                  <div
                    className="d-inline-flex align-items-center p-1 rounded-2 metro__txt-blue metro__card-date-mix">
                    <span className="mb-0 text-spanrimary">{dateValue}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16"
                      viewBox="0 0 14 16" fill="none">
                      <path d="M1.06177 6.26931H12.9444" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.96147 8.87283H9.96765" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.00298 8.87283H7.00915" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.03862 8.87283H4.0448" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.96147 11.4636H9.96765" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7.00298 11.4636H7.00915" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.03862 11.4636H4.0448" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.69576 1.33301V3.52686" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.31027 1.33301V3.52686" stroke="#2A54A7" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path fillRule="evenodd" clipRule="evenodd"
                        d="M9.82551 2.38574H4.18064C2.22285 2.38574 1 3.47636 1 5.48109V11.5142C1 13.5504 2.22285 14.6663 4.18064 14.6663H9.81933C11.7833 14.6663 13 13.5694 13 11.5646V5.48109C13.0062 3.47636 11.7895 2.38574 9.82551 2.38574Z"
                        stroke="#2A54A7" strokeWidth="1.5" strokeLinecap="round"
                        strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div className="text-lg-start w-100">
                  <p className="m-0 metro__card-title-number" s>
                    {labelValue}
                  </p>
                </div>
              </div>

              {/* <!-- Bottom Section: Icon & Description --> */}
              <div className="align-items-start d-flex mt-2 w-100"></div>

            </div>
          </div>
    </>
  );
}

export default DashboardCardsListMix;
