'use client';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import NumberAbbreviate from 'number-abbreviate';

import LandingNav from '@/components/LandingNav';
import Loader from '@/components/ui/loader';

export default function Home() {
  const [data, setData] = useState(null);
  const [latestDataDate, setLatestDataDate] = useState(null);
  const [isReadMorePanelOpen, setIsReadMorePanelOpen] = useState({
    'calls-for-service': false,
    crime: false,
    arrest: false
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}dashboard_details?transport_type=systemwide&published=true`, {
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
        setData(data);

        if (data.last_updated_at || data.crime.current_year_month) {
          const dataAvailableDate = new Date(data.last_updated_at || data.crime.current_year_month);
          const longMonthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];
          const dataAvailableMonth = longMonthNames[dataAvailableDate.getUTCMonth()];
          const dataAvailableYear = dataAvailableDate.getUTCFullYear();

          setLatestDataDate(`${dataAvailableMonth} ${dataAvailableYear}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

  function handleReadMoreToggle(type) {
    setIsReadMorePanelOpen((prevIsReadMorePanelOpenState) => {
      const newIsReadMorePanelOpenState = { ...prevIsReadMorePanelOpenState };
      newIsReadMorePanelOpenState[type] = !prevIsReadMorePanelOpenState[type];

      return newIsReadMorePanelOpenState;
    });
  }

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  return (
    <>
      <LandingNav />
      <main className="min-h-screen relative z-10 overflow-hidden">
        <div className="relative lg:after:block lg:after:absolute lg:after:bg-black lg:after:w-full lg:after:h-full lg:after:-bottom-full lg:after:right-0">
          <div className="relative lg:absolute lg:z-10 lg:inset-0 lg:h-full w-full px-5 lg:px-0 lg:after:block lg:after:h-[310px] lg:after:w-full lg:after:bg-[url('/assets/triangle-curved-black.svg')] lg:after:bg-no-repeat lg:after:absolute lg:after:-bottom-1 lg:after:right-0">
            <div className="container">
              <div className="flex justify-center">
                <Suspense fallback={<Loader />}>
                  {latestDataDate && <h6 className="text-sm xl:text-lg italic text-slate-500 w-max pt-5">{latestDataDate}</h6>}
                </Suspense>
                <Suspense fallback={<Loader />}>
                  <span className="ml-auto">
                    <h6 className="text-sm xl:text-md italic text-slate-500 w-max pt-5 ml-auto">
                      *Data gets updated on 21<sup>st</sup> of every month
                    </h6>
                  </span>
                </Suspense>
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center h-96 lg:h-full py-5">
              <Image
                className="relative h-full lg:h-auto lg:absolute lg:right-0 lg:w-1/2 lg:top-0 lg:pl-8"
                alt="Rail illustration"
                src="/assets/illustration-rail-bus.svg"
                width={579}
                height={703}
                priority
              />
            </div>
          </div>
          <div className="container relative z-30 pt-12">
            <div className="lg:flex px-8 min-h-[75vh]">
              <div className="lg:basis-1/2">
                {data && data.hasOwnProperty('call_for_service') && (
                  <div className="relative">
                    {data.call_for_service.comment && data.call_for_service.comment !== '' && (
                      <>
                        <div
                          className={`absolute z-10 ${
                            isReadMorePanelOpen['calls-for-service'] ? 'left-3/4' : 'left-0'
                          } top-0 pl-44 py-12 pr-10 bg-black/40 h-full w-full rounded-6xl rounded-tl-none`}
                        >
                          <div className="line-clamp-4">
                            <h5 className="text-lg text-white">{data.call_for_service.comment}</h5>
                          </div>
                        </div>
                        <div className="hidden lg:block absolute z-10 -top-7 right-10">
                          <button onClick={() => handleReadMoreToggle('calls-for-service')}>
                            <h6 className="text-sm text-blue-600">Read More</h6>
                          </button>
                        </div>
                      </>
                    )}
                    <div className="relative z-10 flex flex-col md:flex-row justify-center md:justify-start md:items-center bg-black pt-6 px-7 pb-7 lg:pt-9 lg:px-9 lg:pb-10 mt-20 rounded-6xl rounded-tl-none min-h-44">
                      <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                        <ul className="flex flex-wrap items-center justify-between">
                          <li className="inline-flex items-center justify-between mt-4">
                            <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                              {formatNumber(data.call_for_service.current_month_count)}
                            </h3>
                            <h6 className="text-sm text-white font-semibold ml-5">Total Calls</h6>
                          </li>
                        </ul>
                      </div>
                      <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                        <ul className="flex flex-wrap items-center justify-between">
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.call_for_service.previous_month_count)}
                              </h3>
                              {data.call_for_service.previous_month_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.call_for_service.previous_month_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.call_for_service.previous_month_count_percent >= 0
                                      ? data.call_for_service.previous_month_count_percent
                                      : Math.abs(data.call_for_service.previous_month_count_percent)}
                                    %)
                                  </span>
                                  {data.call_for_service.previous_month_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                          </li>
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.call_for_service.previous_year_month_count)}
                              </h3>
                              {data.call_for_service.previous_year_month_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.call_for_service.previous_year_month_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.call_for_service.previous_year_month_count_percent >= 0
                                      ? data.call_for_service.previous_year_month_count_percent
                                      : Math.abs(data.call_for_service.previous_year_month_count_percent)}
                                    %)
                                  </span>
                                  {data.call_for_service.previous_year_month_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="absolute z-30 bottom-full -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:px-5 lg:py-3 rounded-4xl rounded-br-none shadow-lg border border-solid">
                      <Link href={'/call-for-service/system-wide'} className="text-[#000000] hover:text-[#000000] hover:no-underline">
                        <h2 className="md:text-2xl font-medium">Calls for Service</h2>
                      </Link>
                    </div>
                  </div>
                )}
                {data && data.hasOwnProperty('crime') && (
                  <div className="relative">
                    {data.crime.comment && data.crime.comment !== '' && (
                      <>
                        <div
                          className={`absolute z-10 ${
                            isReadMorePanelOpen['crime'] ? 'left-3/4' : 'left-0'
                          } top-0 pl-44 py-12 pr-10 bg-black/40 h-full w-full rounded-6xl rounded-tl-none`}
                        >
                          <div className="line-clamp-4">
                            <h5 className="text-lg text-white">{data.crime.comment}</h5>
                          </div>
                        </div>
                        <div className="hidden lg:block absolute z-10 -top-7 right-10">
                          <button onClick={() => handleReadMoreToggle('crime')}>
                            <h6 className="text-sm text-blue-600">Read More</h6>
                          </button>
                        </div>
                      </>
                    )}
                    <div className="relative z-10 flex flex-col md:flex-row justify-center md:justify-start md:items-center bg-black pt-6 px-7 pb-7 lg:pt-9 lg:px-9 lg:pb-10 mt-20 rounded-6xl rounded-tl-none min-h-44">
                      <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                        <ul className="flex flex-wrap items-center justify-between">
                          <li className="inline-flex items-center justify-between mt-4">
                            <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                              {NumberAbbreviate(data.crime.total_boardings)
                                ? NumberAbbreviate(data.crime.total_boardings).toUpperCase()
                                : null}
                            </h3>
                            <h6 className="text-sm text-white font-semibold ml-5">Boardings</h6>
                          </li>
                          <li className="inline-flex items-center justify-between mt-4">
                            <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                              {formatNumber(data.crime.crime_per_100k_boardings)}
                            </h3>
                            <h6 className="text-sm text-white font-semibold ml-5">Crime per 100K Boardings</h6>
                          </li>
                        </ul>
                      </div>
                      <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                        <ul className="flex flex-wrap items-center justify-between">
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.crime.current_month_count)}
                              </h3>
                              {data.crime.current_month_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.crime.current_month_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.crime.current_month_count_percent >= 0
                                      ? data.crime.current_month_count_percent
                                      : Math.abs(data.crime.current_month_count_percent)}
                                    %)
                                  </span>
                                  {data.crime.current_month_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Current Month</h6>
                          </li>
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.crime.previous_month_count)}
                              </h3>
                              {data.crime.previous_month_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.crime.previous_month_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.crime.previous_month_count_percent >= 0
                                      ? data.crime.previous_month_count_percent
                                      : Math.abs(data.crime.previous_month_count_percent)}
                                    %)
                                  </span>
                                  {data.crime.previous_month_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                          </li>
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.crime.previous_year_count)}
                              </h3>
                              {data.crime.previous_year_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.crime.previous_year_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.crime.previous_year_count_percent >= 0
                                      ? data.crime.previous_year_count_percent
                                      : Math.abs(data.crime.previous_year_count_percent)}
                                    %)
                                  </span>
                                  {data.crime.previous_year_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="absolute z-30 bottom-full -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:px-5 lg:py-3 rounded-4xl rounded-br-none shadow-lg border border-solid">
                      <Link href={'/crime/system-wide'} className="text-[#000000] hover:text-[#000000] hover:no-underline">
                        <h2 className="md:text-2xl font-medium">Crime</h2>
                      </Link>
                    </div>
                  </div>
                )}
                {data && data.hasOwnProperty('arrest') && (
                  <div className="relative">
                    {data.arrest.comment && data.arrest.comment !== '' && (
                      <>
                        <div
                          className={`absolute z-10 ${
                            isReadMorePanelOpen['arrest'] ? 'left-3/4' : 'left-0'
                          } top-0 pl-44 py-12 pr-10 bg-black/40 h-full w-full rounded-6xl rounded-tl-none`}
                        >
                          <div className="line-clamp-4">
                            <h5 className="text-lg text-white">{data.arrest.comment}</h5>
                          </div>
                        </div>
                        <div className="hidden lg:block absolute z-10 -top-7 right-10">
                          <button onClick={() => handleReadMoreToggle('arrest')}>
                            <h6 className="text-sm text-blue-600">Read More</h6>
                          </button>
                        </div>
                      </>
                    )}
                    <div className="relative z-10 flex flex-col md:flex-row justify-center md:justify-start md:items-center bg-black pt-6 px-7 pb-7 lg:pt-9 lg:px-9 lg:pb-10 mt-20 rounded-6xl rounded-tl-none min-h-44">
                      <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                        <ul className="flex flex-wrap items-center justify-between">
                          <li className="inline-flex items-center justify-between mt-4">
                            <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                              {formatNumber(data.arrest.current_month_count)}
                            </h3>
                            <h6 className="text-sm text-white font-semibold ml-5">Total Arrests</h6>
                          </li>
                        </ul>
                      </div>
                      <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                        <ul className="flex flex-wrap items-center justify-between">
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.arrest.previous_month_count)}
                              </h3>
                              {data.arrest.previous_month_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.arrest.previous_month_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.arrest.previous_month_count_percent >= 0
                                      ? data.arrest.previous_month_count_percent
                                      : Math.abs(data.arrest.previous_month_count_percent)}
                                    %)
                                  </span>
                                  {data.arrest.previous_month_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                          </li>
                          <li className="inline-flex items-center justify-between mt-4">
                            <div>
                              <h3 className="text-2xl text-yellow-300 font-semibold min-w-16">
                                {formatNumber(data.arrest.previous_year_count)}
                              </h3>
                              {data.arrest.previous_year_count_percent && (
                                <div
                                  className={`inline-flex flex-wrap items-center justify-start p-1 rounded ${
                                    data.crime.previous_year_count_percent >= 0 ? 'bg-red-600' : 'bg-lime-600'
                                  }`}
                                >
                                  <span className="text-sm text-white">
                                    (
                                    {data.arrest.previous_year_count_percent >= 0
                                      ? data.arrest.previous_year_count_percent
                                      : Math.abs(data.arrest.previous_year_count_percent)}
                                    %)
                                  </span>
                                  {data.arrest.previous_year_count_percent >= 0 ? (
                                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  ) : (
                                    <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path
                                        d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                        fill="#FFF"
                                      />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </div>
                            <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="absolute z-30 bottom-full -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:px-5 lg:py-3 rounded-4xl rounded-br-none shadow-lg border border-solid">
                      <Link href={'/arrest/system-wide'} className="text-[#000000] hover:text-[#000000] hover:no-underline">
                        <h2 className="md:text-2xl font-medium">Arrests</h2>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="py-12 flex justify-end">
              <Link
                href="/crime/rail"
                className="flex items-center bg-black lg:bg-white border border-solid rounded-6xl pl-9 py-3.5 pr-14 relative after:absolute after:h-2 after:w-5 after:bg-[url('/assets/arrow-right.svg')] after:bg-no-repeat after:bg-contain after:top-1/2 after:-translate-y-1/2 after:right-6"
              >
                <span className="text-base text-white lg:text-black font-bold">Go To Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
