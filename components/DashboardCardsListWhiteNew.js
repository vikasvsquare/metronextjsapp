'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';
import Image from 'next/image';
import MonthlyWeeklyToggle from './MonthlyWeeklyToggle';
import dayjs from 'dayjs';
import TrendingUpIcon from '@/assets/svg/TrendingUpIcon.svg';

function DashboardCardsListWhiteNew({ label, current_month, previous_month_count, previous_month_year, percentage, previous_year_count, previous_year_count_percent, previous_year_upDown, upDown }) {

  return (
    <>
      <div className="metro-custom_card-wrapper metro__crime-card text-white">
        <div className="card-body d-flex flex-column justify-content-between h-100">

          {/* <!-- Top Section: Title & Date --> */}
          <div className="card-wrapper">
            <div className="align-items-center d-flex justify-content-between w-100">
              <div className="m-0 metro-new__card-title source-sans-3-700">
                {label}
              </div>
            </div>
            <div className="text-lg-start w-100">
              <p className="m-0 metro-new__card-count">
                {current_month}
              </p>
            </div>
          </div>

          {/* <!-- Bottom Section: Icon & Description --> */}
          <div className="align-items-center d-flex  w-100 d-flex items-center gap-10px justify-content-between">
            <div className='d-flex items-center box-1'>
              <div className="d-flex align-items-center">
                {/* <Image src={TrendingUpIcon} alt="trending up" width={30} height={30} /> */}
                {upDown ? (
                  <Image
                    src={TrendingUpIcon}
                    alt="trending up"
                    width={30}
                    height={30}
                    className='imgIcon'
                  />
                ) : (
                  <Image
                    src={TrendingUpIcon}
                    alt="trending down"
                    width={30}
                    height={30}
                    style={{ transform: 'rotate(80deg)' }}
                    className='imgIcon'
                  />
                )}
              </div>
              <div className="d-flex flex-column box-1__content">
                <div className="ds-card-font metro-new__card-summary">{previous_month_count}<span className='metro-new__card-summary-span'>({upDown ? `+` : `-`}{percentage}%)</span></div>
                <div className="ds-card-font metro-new__card-year">{dayjs(previous_month_year).subtract(1, 'month').format("MMM YYYY")}</div>
              </div>
            </div>

            <div className='d-flex items-center box-1'>
              <div className="d-flex align-items-center">
                {previous_year_upDown ? (
                  <Image
                    src={TrendingUpIcon}
                    alt="trending up"
                    width={30}
                    height={30}
                    className='imgIcon'
                  />
                ) : (
                  <Image
                    src={TrendingUpIcon}
                    alt="trending down"
                    width={30}
                    height={30}
                    style={{ transform: 'rotate(80deg)' }}
                    className='imgIcon'
                  />
                )}
              </div>
              <div className="d-flex flex-column box-1__content">
                <div className="ds-card-font metro-new__card-summary">{previous_year_count}<span className='metro-new__card-summary-span'>({previous_year_upDown ? `+` : `-`}{previous_year_count_percent}%)</span></div>
                <div className="ds-card-font metro-new__card-year">{dayjs(previous_month_year).subtract(1, 'year').format("MMM YYYY")} </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default DashboardCardsListWhiteNew;
