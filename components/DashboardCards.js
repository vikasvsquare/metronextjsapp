'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';
import Image from 'next/image';
import MonthlyWeeklyToggle from './MonthlyWeeklyToggle';
import dayjs from 'dayjs';
import DashboardCardsListBlue from './DashboardCardsListBlue';
import DashboardCardsListWhite from './DashboardCardsListWhite';
import DashboardCardsListMix from './DashboardCardsListMix';
import DashboardCardsListWhiteYear from './DashboardCardsListWhiteYear';
import DashboardCardsListWhiteNew from './DashboardCardsListWhiteNew';

function DashboardCards() {
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
    return Number(num?.toLocaleString('en-US').replace(/,/g, ''));
  }

  function handleVettedToggle(value) {

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

      {/* crime  */}
      {(pathName === '/' || statType === '') || statType === 'crime' ? (
        data && data.hasOwnProperty('crime') && (
          <>
            <div className="SaftyDashboard container-fluid w-100 px-4 pt-4">
              <div className='row'>
                <div className='col-md-12'>
                  <div className="mb-3">
                    <h2 className="metro__main-title">Safety Dashboard</h2>
                    <p className="metro__main-breadcrumb">{(pathName === '/' || statType === '') ? 'Crime' : statType} | {pathName === '/crime/bus' ? 'Bus' : pathName === '/crime/rail' ? 'Rail' : 'Systemwide'}</p>
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className="d-flex flex-wrap gap-2">
                    {/* incidence response time  */}
                    <DashboardCardsListBlue label={'Incident Free Trips'} labelValue={''}
                      current_month={formatNumber(data?.crime.current_month_count)}
                      total_boardings={formatNumber(data?.crime.total_boardings)}
                    />

                    <DashboardCardsListBlue label={'Total Boardings'} labelValue={NumberAbbreviate(data?.crime.total_boardings)
                      ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                      : null} />
                    <DashboardCardsListBlue label={'Crime per 1M Boarding'} labelValue={data?.crime.crime_per_100k_boardings
                      ? data?.crime.crime_per_100k_boardings
                      : null} />

                    <DashboardCardsListWhiteNew label={'Current Month: Total Crimes'}
                      current_month={formatNumber(data?.crime.current_month_count)}
                      previous_month_count={formatNumber(data?.crime.previous_month_count)}
                      previous_month_year={data?.crime.current_year_month}
                      percentage={data?.crime?.previous_month_count_percent >= 0 ? data.crime.previous_month_count_percent : Math.abs(data?.crime.previous_month_count_percent)}
                      previous_year_count={formatNumber(data?.crime.previous_year_count)}
                      previous_year_count_percent={Math.abs((formatNumber(data?.crime.current_month_count) - formatNumber(data?.crime.previous_year_count)) / formatNumber(data?.crime.previous_year_count) * 100).toFixed()}
                      previous_year_upDown={data.crime.previous_year_count_percent >= 0 ? true : false}
                      upDown={data.crime.previous_month_count_percent >= 0 ? true : false} />

                    <DashboardCardsListWhiteNew label={'Previous Month: Total Crimes'}
                      current_month={formatNumber(data?.crime_additional?.current_month_count)}
                      previous_month_count={formatNumber(data?.crime_additional?.previous_month_count)}
                      previous_month_year={data?.crime_additional?.current_year_month}
                      percentage={data?.crime?.previous_month_count_percent >= 0 ? data.crime.previous_month_count_percent : Math.abs(data?.crime_additional?.previous_month_count_percent)}
                      previous_year_count={formatNumber(data?.crime_additional?.previous_year_count)}
                      previous_year_count_percent={Math.abs((formatNumber(data?.crime_additional?.current_month_count) - formatNumber(data?.crime_additional?.previous_year_count)) / formatNumber(data?.crime_additional?.previous_year_count) * 100).toFixed()}
                      previous_year_upDown={data.crime.previous_year_count_percent >= 0 ? true : false}
                      upDown={data?.crime_additional?.previous_month_count_percent >= 0 ? true : false} />

                    {/* <DashboardCardsListWhite label={'Total crimes'}
                      labelValue={formatNumber(data?.crime.previous_month_count)}
                      dateValue={data?.crime.current_year_month}
                      percentage={data?.crime?.previous_month_count_percent >= 0 ? data.crime.previous_month_count_percent : Math.abs(data?.crime.previous_month_count_percent)}
                      upDown={data.crime.previous_month_count_percent >= 0 ? true : false} />
                    <DashboardCardsListWhiteYear label={'Total crimes'}
                      labelValue={formatNumber(data?.crime.previous_year_count)}
                      dateValue={data?.crime.current_year_month}
                      percentage={Math.abs((formatNumber(data?.crime.current_month_count) - formatNumber(data?.crime.previous_year_count)) / formatNumber(data?.crime.previous_year_count) * 100).toFixed()}
                      upDown={data.crime.previous_year_count_percent >= 0 ? true : false} /> */}

                  </div>
                </div>
                <div className='col-md-12'>
                  <p className="metro__txt-xsmall mt-3 d-flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="7" viewBox="0 0 6 7" fill="none">
                      <path d="M6 3.5L0.75 6.53109V0.468911L6 3.5Z" fill="#2A54A7" />
                    </svg>
                    <span>Latest Dataset: {latestDate}, Data is updated on the 21<sup>st</sup> of every month
                    </span>
                  </p>
                </div>
              </div>



            </div>
          </>
        )
      ) : null}

      {/* arrests  */}
      {pathName === '/arrests' || statType === 'arrests' ? (
        data && data.hasOwnProperty('arrest') && (
          <div className="SaftyDashboard container-fluid w-100 p-4">
            <div className="mb-3">
              <h2 className="metro__main-title">Safety Dashboard</h2>
              <p className="metro__main-breadcrumb">{statType === 'arrests' ? 'Arrests' : ''} | {pathName === '/arrests/rail' ? 'Rail' : pathName === '/arrests/bus' ? 'Bus' : 'Systemwide'}</p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {/* incidence response time  */}
              <DashboardCardsListBlue label={'Incident Free Trips'} labelValue={''}
                current_month={formatNumber(data?.crime.current_month_count)}
                total_boardings={formatNumber(data?.crime.total_boardings)}
              />
              <DashboardCardsListBlue label={'Passenger Boardings'} labelValue={NumberAbbreviate(data?.crime.total_boardings)
                ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                : null} />
              {/* <DashboardCardsListMix label={'Total Arrests'} labelValue={formatNumber(data.arrest.current_month_count)} dateValue={dayjs(data?.arrest.current_year_month).format("MMMM YYYY")} /> */}
              {/* <DashboardCardsListWhite label={'Total Arrests'} labelValue={formatNumber(data.arrest.previous_month_count)}
                dateValue={data?.arrest.current_year_month}
                percentage={data.arrest.previous_month_count_percent >= 0
                  ? data?.arrest?.previous_month_count_percent
                  : Math.abs(data.arrest.previous_month_count_percent)}
                upDown={data.arrest.previous_month_count_percent >= 0 ? true : false} />
              <DashboardCardsListWhiteYear label={'Total Arrests'}
                labelValue={formatNumber(data.arrest.previous_year_count)}
                dateValue={data?.arrest.current_year_month}
                percentage={Math.abs((formatNumber(data?.arrest.current_month_count) - formatNumber(data?.arrest.previous_year_count)) / formatNumber(data?.arrest.previous_year_count) * 100).toFixed()}
                upDown={data.arrest.previous_year_count_percent >= 0 ? true : false} /> */}

              <DashboardCardsListWhiteNew label={'Current Month: Total Arrests'}
                current_month={formatNumber(data?.arrest.current_month_count)}
                previous_month_count={formatNumber(data?.arrest.previous_month_count)}
                previous_month_year={data?.arrest.current_year_month}
                percentage={data?.arrest?.previous_month_count_percent >= 0 ? data.arrest.previous_month_count_percent : Math.abs(data?.arrest.previous_month_count_percent)}
                previous_year_count={formatNumber(data?.arrest.previous_year_count)}
                previous_year_count_percent={Math.abs((formatNumber(data?.arrest.current_month_count) - formatNumber(data?.arrest.previous_year_count)) / formatNumber(data?.arrest.previous_year_count) * 100).toFixed()}
                previous_year_upDown={data.arrest.previous_year_count_percent >= 0 ? true : false}
                upDown={data.arrest.previous_month_count_percent >= 0 ? true : false} />

              <DashboardCardsListWhiteNew label={'Previous Month: Total Arrests'}
                current_month={formatNumber(data?.arrest_additional?.current_month_count)}
                previous_month_count={formatNumber(data?.arrest_additional?.previous_month_count)}
                previous_month_year={data?.arrest_additional?.current_year_month}
                percentage={data?.arrest?.previous_month_count_percent >= 0 ? data.arrest.previous_month_count_percent : Math.abs(data?.arrest_additional?.previous_month_count_percent)}
                previous_year_count={formatNumber(data?.arrest_additional?.previous_year_count)}
                previous_year_count_percent={Math.abs((formatNumber(data?.arrest_additional?.current_month_count) - formatNumber(data?.arrest_additional?.previous_year_count)) / formatNumber(data?.arrest_additional?.previous_year_count) * 100).toFixed()}
                previous_year_upDown={data.arrest.previous_year_count_percent >= 0 ? true : false}
                upDown={data?.arrest_additional?.previous_month_count_percent >= 0 ? true : false} />
            </div>
            <p className="metro__txt-xsmall mt-3 d-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="7" viewBox="0 0 6 7" fill="none">
                <path d="M6 3.5L0.75 6.53109V0.468911L6 3.5Z" fill="#2A54A7" />
              </svg>
              <span>Latest Dataset: {latestDate}, Data is updated on the 21<sup>st</sup> of every month
              </span>
            </p>
          </div>
        )
      ) : null}

      {/* calls for service  */}
      {pathName === 'calls-for-service' || statType === 'calls-for-service' ? (
        data && data.hasOwnProperty('call_for_service') && (
          <div className="SaftyDashboard container-fluid w-100 p-4">
            <div className="mb-3">
              <h2 className="metro__main-title">Safety Dashboard</h2>
              <p className="metro__main-breadcrumb">{statType === 'calls-for-service' ? 'Calls for Service' : ''} | {pathName === '/calls-for-service/rail' ? 'Rail' : pathName === '/calls-for-service/bus' ? 'Bus' : 'Systemwide'}</p>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {/* incidence response time  */}
              <DashboardCardsListBlue label={'Incident Free Trips'} labelValue={''}
                current_month={formatNumber(data?.crime.current_month_count)}
                total_boardings={formatNumber(data?.crime.total_boardings)}
              />
              
              <DashboardCardsListBlue label={'Passenger Boardings'} labelValue={NumberAbbreviate(data?.crime.total_boardings)
                ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                : null} />
              {/* <DashboardCardsListMix label={'Total Calls'} labelValue={formatNumber(data.call_for_service.current_month_count)} dateValue={dayjs(data?.call_for_service.current_year_month).format("MMMM YYYY")} />
              <DashboardCardsListWhite label={'Total Calls'} labelValue={formatNumber(data.call_for_service.previous_month_count)}
                dateValue={data?.crime.current_year_month} percentage={data.call_for_service.previous_month_count_percent >= 0
                  ? data.call_for_service.previous_month_count_percent
                  : Math.abs(data.call_for_service.previous_month_count_percent)}
                upDown={data.call_for_service.previous_month_count_percent >= 0 ? true : false} />
              <DashboardCardsListWhiteYear label={'Total Calls'}
                labelValue={formatNumber(data.call_for_service.previous_year_month_count)}
                dateValue={data?.call_for_service.current_year_month}
                percentage={Math.abs((formatNumber(data.call_for_service.current_month_count) - formatNumber(data.call_for_service.previous_year_month_count)) / formatNumber(data.call_for_service.previous_year_month_count) * 100).toFixed()}
                upDown={data.call_for_service.previous_year_month_count_percent >= 0 ? true : false} /> */}

              <DashboardCardsListWhiteNew label={'Current Month: Total Calls'}
                current_month={formatNumber(data?.call_for_service.current_month_count)}
                previous_month_count={formatNumber(data?.call_for_service.previous_month_count)}
                previous_month_year={data?.call_for_service.current_year_month}
                percentage={data.call_for_service.previous_month_count_percent >= 0 ? data.call_for_service.previous_month_count_percent : Math.abs(data.call_for_service.previous_month_count_percent)}
                previous_year_count={formatNumber(data.call_for_service.previous_year_month_count)}
                previous_year_count_percent={Math.abs((formatNumber(data.call_for_service.current_month_count) - formatNumber(data.call_for_service.previous_year_month_count)) / formatNumber(data.call_for_service.previous_year_month_count) * 100).toFixed()}
                previous_year_upDown={data.arrest.previous_year_count_percent >= 0 ? true : false}
                upDown={data.arrest.previous_month_count_percent >= 0 ? true : false} />

              <DashboardCardsListWhiteNew label={'Previous Month: Total Calls'}
                current_month={formatNumber(data?.call_for_service_additional?.current_month_count)}
                previous_month_count={formatNumber(data?.call_for_service_additional?.previous_month_count)}
                previous_month_year={data?.call_for_service_additional?.current_year_month}
                percentage={data?.call_for_service?.previous_month_count_percent >= 0 ? data.arrest.previous_month_count_percent : Math.abs(data?.call_for_service_additional?.previous_month_count_percent)}
                previous_year_count={formatNumber(data?.call_for_service_additional?.previous_year_count)}
                previous_year_count_percent={Math.abs((formatNumber(data?.call_for_service_additional?.current_month_count) - formatNumber(data?.call_for_service_additional?.previous_year_count)) / formatNumber(data?.call_for_service_additional?.previous_year_count) * 100).toFixed()}
                previous_year_upDown={data.arrest.previous_year_count_percent >= 0 ? true : false}
                upDown={data?.call_for_service_additional?.previous_month_count_percent >= 0 ? true : false} />
            </div>
            <p className="metro__txt-xsmall mt-3 d-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="6" height="7" viewBox="0 0 6 7" fill="none">
                <path d="M6 3.5L0.75 6.53109V0.468911L6 3.5Z" fill="#2A54A7" />
              </svg>
              <span>Latest Dataset: {latestDate}, Data is updated on the 21<sup>st</sup> of every month
              </span>
            </p>
          </div>
        )
      ) : null}
    </>
  );
}

export default DashboardCards;
