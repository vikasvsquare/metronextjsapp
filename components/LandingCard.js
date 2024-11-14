'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';
import Image from 'next/image';
import MonthlyWeeklyToggle from './MonthlyWeeklyToggle';
function LandingCard() {
  const [data, setData] = useState(null);
  const [vetted, setVetted] = useState(true);
  const [published, setPublished] = useState(true);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [statType, transportType] = pathName.substring(1).split('/');
  const [latestDate, setLatestDate] = useState(null);

  const vettedType = searchParams.get('vetted');
  const publishType = searchParams.get('published');

  useEffect(() => {
    setInterval(() => {
      const storedValue = localStorage.getItem('latestDate');
      if (storedValue) {
        setLatestDate(storedValue);
      }
    }, 3000);
  });

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
    setVetted(true);
    if (vettedType && vettedType === "false") {
      setVetted(false);
    }
    if (vettedType && vettedType === "true") {
      setVetted(true);
    }
  }, [vettedType, pathName])

  useEffect(() => {
    async function fetchData(transportType) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}dashboard_details?transport_type=${transportType}&published=${published}`, {
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
      } catch (error) {
        console.log(error);
      }
    }

    if (pathName !== '/') {
      let [statType, transportType] = pathName.substring(1).split('/');
      if (transportType === 'system-wide') {
        transportType = 'systemwide';
      }
      if (statType === "arrests") {
        fetchData(transportType);
      } else if (statType === "calls-for-service") {
        fetchData(transportType);
      }
      else {
        fetchData(transportType);
      }
    } else {
      fetchData('systemwide');
    }

  }, [pathName]);

  function formatNumber(num) {
    return num?.toLocaleString('en-US');
  }

  function handleVettedToggle(value) {
    console.log(value)
    if (value) {
      setVetted(true);
      const query = new URLSearchParams({
        "line": "all",
        "type": "chart",
        "vetted": value,
        "published": published
      }).toString();

      router.push(`${pathName}/?${query}`);

    } else {
      setVetted(false);
      const query = new URLSearchParams({
        "line": "all",
        "type": "chart",
        "vetted": value,
        "published": published
      }).toString();

      router.push(`${pathName}/?${query}`);
    }
  }

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      {(pathName === '/' || statType === '') || statType === 'crime' ? (
        data && data.hasOwnProperty('crime') && (
          <>
            <div className="container-fluid custom-boxShadaow">
              <div className="container py-3">
                <div className="row">
                  <div className="col-md-2 linecard-title">
                    <div className='w-full'>
                      <p className='head'>{(pathName === '/' || statType === '') ? 'Crime' : statType}</p>
                      <p className='subTitle'>{pathName === '/crime/bus' ? 'Bus' : pathName === '/crime/rail' ? 'Rail' : 'Systemwide'}</p>
                    </div>
                    <Image
                      alt="Crime Systemwide"
                      src="/assets/breadcrumbs.svg"
                      width={56}
                      height={56}
                      priority
                      style={{ top: 22 }}
                    />
                  </div>
                  <div className="col-md-8 d-flex gap-3 justify-content-end p-0 stats top-cards">
                    <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                      <h5>{NumberAbbreviate(data?.crime.total_boardings)
                        ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                        : null}</h5>
                      <p>Boardings</p>
                    </div>
                    <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards py-2">
                      <h5>{data?.crime.crime_per_100k_boardings
                        ? data?.crime.crime_per_100k_boardings
                        : null}</h5>
                      <p>Crime/1M Boardings</p>
                    </div>
                    <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                      <h5>{formatNumber(data?.crime.current_month_count)}</h5>
                      <p>Current Month</p>
                    </div>
                    <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                      <h5 className="align-items-baseline align-items-center d-flex justify-between">
                        <span>{formatNumber(data?.crime.previous_month_count)} </span>
                        <span className={`d-flex text-danger-red ${data?.crime?.previous_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>
                          ({data?.crime?.previous_month_count_percent >= 0
                            ? data.crime.previous_month_count_percent
                            : Math.abs(data?.crime.previous_month_count_percent)}%)
                        </span>
                        {data?.crime?.previous_month_count_percent >= 0 ? (
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                              fill="#F00"
                            />
                          </svg>
                        ) : (
                          <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                              fill="#006400 "
                            />
                          </svg>
                        )}
                      </h5>
                      <p>Previous Month</p>
                    </div>
                    <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                      <h5 className="align-items-baseline align-items-center d-flex justify-between">
                        <span>{formatNumber(data?.crime.previous_year_count)} </span>
                        <span className={`d-flex text-danger-red ${data?.crime?.previous_year_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>
                          ({data?.crime.previous_year_count_percent >= 0
                            ? data?.crime.previous_year_count_percent
                            : Math.abs(data?.crime.previous_year_count_percent)}%)</span>
                        {data.crime.previous_year_count_percent >= 0 ? (
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                              fill="#F00"
                            />
                          </svg>
                        ) : (
                          <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                              fill="#006400"
                            />
                          </svg>
                        )}
                      </h5>
                      <p>Previous Year</p>
                    </div>
                  </div>
                  {/* <div className="col-md-2 date-flag">
                  <span>
                    <strong>January 2024</strong><br /> *Data is updated on the 21<sup>st</sup> of every month
                  </span>
                </div> */}
                  <div className="align-items-center col-md-2 d-flex gap-2 justify-content-center month-week-data">
                    <p style={{ fontSize: 14, textAlign: 'center' }}>Latest Dataset: <strong>{latestDate}</strong> <sup>*</sup>Data is updated on the 21<sup>st</sup> of every month. </p>
                    {/* <strong>{latestDate}&nbsp; </strong> | <sup>*</sup>Data is updated on the 21<sup style={{ top: 3 }}>st</sup> of every month */}
                    {/* <button className={`${vetted ? 'active' : ''}`} onClick={() => handleVettedToggle(true)}>Monthly </button> |
                    <button className={`${vetted ? '' : 'active'}`} onClick={() => handleVettedToggle(false)}>Weekly </button> */}
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      ) : null}


      {pathName === 'calls-for-service' || statType === 'calls-for-service' ? (
        data && data.hasOwnProperty('call_for_service') && (
          <div className="container-fluid custom-boxShadaow">
            <div className="container py-3">
              <div className="row">
                <div className="col-md-2 linecard-title">
                  <div className='w-full'>
                    <p className='head'>{statType === 'calls-for-service' ? 'Calls for Service' : ''}</p>
                    <p className='subTitle'>{pathName === '/calls-for-service/rail' ? 'Rail' : pathName === '/calls-for-service/bus' ? 'Bus' : 'Systemwide'}</p>
                  </div>
                  <Image
                    alt="Crime Systemwide"
                    src="/assets/breadcrumbs.svg"
                    width={56}
                    height={56}
                    priority
                    style={{ top: 22 }}
                  />
                </div>
                <div className="col-md-8 d-flex gap-3 justify-content-end p-0 stats  top-cards">
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5>{NumberAbbreviate(data?.crime.total_boardings)
                      ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                      : null}</h5>
                    <p>Boardings</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5> {formatNumber(data.call_for_service.current_month_count)}</h5>
                    <p>Total Calls</p>
                  </div>

                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span> {formatNumber(data.call_for_service.previous_month_count)}</span>
                      <span className={`d-flex text-danger-red ${data?.call_for_service?.previous_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>(
                        {data.call_for_service.previous_month_count_percent >= 0
                          ? data.call_for_service.previous_month_count_percent
                          : Math.abs(data.call_for_service.previous_month_count_percent)}%)
                      </span>
                      {data.call_for_service.previous_month_count_percent >= 0 ? (
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                            fill="#F00"
                          />
                        </svg>
                      ) : (
                        <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                            fill="#006400"
                          />
                        </svg>
                      )}
                    </h5>
                    <p>Previous Month</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data.call_for_service.previous_year_month_count)} </span>
                      <span className={`d-flex text-danger-red ${data?.call_for_service?.previous_year_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>
                        ({data.call_for_service.previous_year_month_count_percent >= 0
                          ? data.call_for_service.previous_year_month_count_percent
                          : Math.abs(data.call_for_service.previous_year_month_count_percent)}%)</span>
                      {data.call_for_service.previous_year_month_count_percent >= 0 ? (
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                            fill="#F00"
                          />
                        </svg>
                      ) : (
                        <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                            fill="#006400"
                          />
                        </svg>
                      )}
                    </h5>
                    <p>Previous Year</p>
                  </div>
                </div>
                <div className="align-items-center col-md-2 d-flex gap-2 justify-content-center month-week-data">
                  <p style={{ fontSize: 14, textAlign: 'center' }}>Latest Dataset: <strong>{latestDate}</strong> <sup>*</sup>Data is updated on the 21<sup>st</sup> of every month. </p>
                  {/* <button className='active'>Monthly </button> |
                  <button disabled>Weekly </button> */}
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

      {pathName === '/arrests' || statType === 'arrests' ? (
        data && data.hasOwnProperty('arrest') && (
          <div className="container-fluid custom-boxShadaow">
            <div className="container py-3">
              <div className="row">
                <div className="col-md-2 linecard-title">
                  <div className='w-full'>
                    <p className='head'>{statType === 'arrests' ? 'Arrest' : ''}</p>
                    <p className='subTitle'>{pathName === '/arrests/rail' ? 'Rail' : pathName === '/arrests/bus' ? 'Bus' : 'Systemwide'}</p>
                  </div>

                  <Image
                    alt="Crime Systemwide"
                    src="/assets/breadcrumbs.svg"
                    width={56}
                    height={56}
                    priority
                    style={{ top: 22 }}
                  />
                </div>
                <div className="col-md-8 d-flex gap-3 justify-content-end p-0 stats  top-cards">
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5>{NumberAbbreviate(data?.crime.total_boardings)
                      ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                      : null}</h5>
                    <p>Boardings</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5>{formatNumber(data.arrest.current_month_count)}</h5>
                    <p>Total Arrests</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data.arrest.previous_month_count)}</span>
                      <span className={`d-flex text-danger-red ${data?.arrest?.previous_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>(
                        {data.arrest.previous_month_count_percent >= 0
                          ? data?.arrest?.previous_month_count_percent
                          : Math.abs(data.arrest.previous_month_count_percent)}%)
                        {data.arrest.previous_month_count_percent >= 0 ? (
                          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                              fill="#F00"
                            />
                          </svg>
                        ) : (
                          <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                              fill="#006400"
                            />
                          </svg>
                        )}
                      </span>
                    </h5>
                    <p>Previous Month</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data.arrest.previous_year_count)} </span>
                      <span className={`d-flex text-danger-red ${data?.arrest?.previous_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>
                        ({data.arrest.previous_year_count_percent >= 0
                          ? data.arrest.previous_year_count_percent
                          : Math.abs(data.arrest.previous_year_count_percent)}%)</span>
                      {data.arrest.previous_year_count_percent >= 0 ? (
                        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                            fill="#F00"
                          />
                        </svg>
                      ) : (
                        <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                            fill="#006400"
                          />
                        </svg>
                      )}
                    </h5>
                    <p>Previous Year</p>
                  </div>
                </div>
                <div className="align-items-center col-md-2 d-flex gap-2 justify-content-center month-week-data">
                  <p style={{ fontSize: 14, textAlign: 'center' }}>Latest Dataset: <strong>{latestDate}</strong> <sup>*</sup>Data is updated on the 21<sup>st</sup> of every month. </p>
                  {/* <button className='active'>Monthly </button> |
                  <button disabled>Weekly </button> */}
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

      <div className='container d-flex italic justify-content-end mb-3 mt-3 landDateToolTip' style={{ color: '#a0a0a0' }}>
        <MonthlyWeeklyToggle handleVettedToggle={handleVettedToggle} />
        {/* <strong>{latestDate}&nbsp; </strong> | *Data is updated on the 21<sup style={{ top: 3 }}>st</sup> of every month */}
      </div>
    </>
  );
}

export default LandingCard;
