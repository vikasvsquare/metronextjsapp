'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';

function LandingCard() {
  const [data, setData] = useState(null);
  const [vetted, setVetted] = useState(true);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [statType, transportType] = pathName.substring(1).split('/');
  const vettedType = searchParams.get('vetted');

  useEffect(() => {
    if(vettedType === "false"){
      setVetted(false);
    }else{
      setVetted(true);
    }
  }, [vettedType])
  
  useEffect(() => {
    async function fetchData(transportType) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}dashboard_details?transport_type=${transportType}&published=true`, {
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
      fetchData('rail');
    }

  }, [pathName]);

  function formatNumber(num) {
    return num?.toLocaleString('en-US');
  }

  function handleVettedToggle(value) {
    if (value) {
      setVetted(true);
      // router.push(pathName + '?' + createQueryString('line', 'all'));
      // router.push(pathName + '?' + createQueryString('type', 'chart'));
      // router.push(pathName + '?' + createQueryString('vetted', value));

      const query = new URLSearchParams({
        "line": "all",
        "type": "chart",
        "vetted": value
      }).toString();
  
      router.push(`${pathName}/?${query}`);

    } else {
      setVetted(false);
      router.push(pathName + '?' + createQueryString('type', 'chart'));
      router.push(pathName + '?' + createQueryString('vetted', value));
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
      {pathName === '/crime'|| statType === 'crime' ? (
        data && data.hasOwnProperty('crime') && (
          <div className="container-fluid custom-boxShadaow">
            <div className="container py-3 mb-5">
              <div className="row">
                <div className="col-md-9 d-flex gap-3 p-0 stats top-cards">
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5>{NumberAbbreviate(data?.crime.total_boardings)
                      ? NumberAbbreviate(data?.crime.total_boardings).toUpperCase()
                      : null}</h5>
                    <p>Boardings</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5>{formatNumber(data?.crime.current_month_count)}</h5>
                    <p>Current Month</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data?.crime.previous_month_count)} </span>
                      <span className={`text-danger text-danger-red ${data?.crime?.previous_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>({data?.crime?.previous_month_count_percent >= 0
                        ? data.crime.previous_month_count_percent
                        : Math.abs(data?.crime.previous_month_count_percent)}%)
                      </span>
                    </h5>
                    <p>Previous Month</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data?.crime.previous_year_count)} </span><span className="text-danger text-danger-red">({data?.crime.previous_year_count_percent >= 0
                        ? data?.crime.previous_year_count_percent
                        : Math.abs(data?.crime.previous_year_count_percent)}%)</span>
                    </h5>
                    <p>Previous Year</p>
                  </div>
                </div>
                <div className="align-items-center col-md-3 d-flex gap-2 justify-content-center month-week-data">
                    <button className={`${vetted ? 'active' : ''}`} onClick={() => handleVettedToggle(true)}>Monthly Data </button> |
                    <button className={`${vetted ? '' : 'active'}`} onClick={() => handleVettedToggle(false)}>Weekly Data </button>
                  </div>
              </div>
            </div>
          </div>
        )
      ) : null}


      {(pathName === '/' || statType === '') || statType === 'calls-for-service' ? (
        data && data.hasOwnProperty('call_for_service') && (
          <div className="container-fluid custom-boxShadaow">
            <div className="container py-3 mb-5">
              <div className="row">
                <div className="col-md-9 d-flex gap-3 p-0 stats top-cards">
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5> {formatNumber(data.call_for_service.current_month_count)}</h5>
                    <p>Total Calls</p>
                  </div>

                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span> {formatNumber(data.call_for_service.previous_month_count)}</span>
                      <span className={`text-danger text-danger-red ${data?.call_for_service?.previous_month_count >= 0 ? 'text-danger' : 'text-success'} `}>(
                        {data.call_for_service.previous_month_count_percent >= 0
                          ? data.call_for_service.previous_month_count_percent
                          : Math.abs(data.call_for_service.previous_month_count_percent)}%)
                      </span>
                    </h5>
                    <p>Previous Month</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data.call_for_service.previous_year_month_count)} </span><span className="text-danger text-danger-red">(
                        {data.call_for_service.previous_year_month_count_percent >= 0
                          ? data.call_for_service.previous_year_month_count_percent
                          : Math.abs(data.call_for_service.previous_year_month_count_percent)}%)</span>
                    </h5>
                    <p>Previous Year</p>
                  </div>
                </div>
                <div className="align-items-center col-md-3 d-flex gap-2 justify-content-center month-week-data">
                  <button disabled>Monthly Data </button> |
                  <button disabled>Weekly Data </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

      {pathName === '/arrests' || statType === 'arrests' ? (
        data && data.hasOwnProperty('arrest') && (
          <div className="container-fluid custom-boxShadaow">
            <div className="container py-3 mb-5">
              <div className="row">
                <div className="col-md-9 d-flex gap-3 p-0 stats top-cards">
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5>{formatNumber(data.arrest.current_month_count)}</h5>
                    <p>Total Arrests</p>
                  </div>
                  {/* <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                  <h5> {formatNumber(data.arrest.previous_month_count)}</h5>
                  <p>Current Month</p>
                </div> */}
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data.arrest.previous_month_count)}</span>
                      <span className={`text-danger text-danger-red ${data?.crime?.previous_month_count_percent >= 0 ? 'text-danger' : 'text-success'} `}>(
                        {data.arrest.previous_month_count_percent >= 0
                          ? data.arrest.previous_month_count_percent
                          : Math.abs(data.arrest.previous_month_count_percent)}%)
                      </span>
                    </h5>
                    <p>Previous Month</p>
                  </div>
                  <div className="align-items-center d-flex flex-column gap-2 justify-content-center landing-cards">
                    <h5 className="align-items-baseline align-items-center d-flex justify-between">
                      <span>{formatNumber(data.arrest.previous_year_count)} </span><span className="text-danger text-danger-red">
                        ({data.arrest.previous_year_count_percent >= 0
                          ? data.arrest.previous_year_count_percent
                          : Math.abs(data.arrest.previous_year_count_percent)}%)</span>
                    </h5>
                    <p>Previous Year</p>
                  </div>
                </div>
                <div className="align-items-center col-md-3 d-flex gap-2 justify-content-center month-week-data">
                  <button disabled>Monthly Data </button> |
                  <button disabled>Weekly Data </button>
                </div>
              </div>
            </div>
          </div>
        )
      ) : null}

    </>
  );
}

export default LandingCard;
