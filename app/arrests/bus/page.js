'use client';
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchAllLines, fetchTimeRange } from '@/lib/action';

import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import Loader from '@/components/ui/loader';

// import ApexLineChart from '@/components/charts/ApexLineChart';
// import PieApexchart from '@/components/charts/PieApexchart';
// import ReactApexchartLine from '@/components/charts/ReactApexchartLine';
// import ReactApexchartBar2 from '@/components/charts/ReactApexchartBar2';
import dynamic from 'next/dynamic';
const ReactApexchartBar2 = dynamic(() => import('@/components/charts/ReactApexchartBar2'), {
  ssr: false,
});
const ReactApexchartLine = dynamic(() => import('@/components/charts/ReactApexchartLine'), {
  ssr: false,
});
const PieApexchart = dynamic(() => import('@/components/charts/PieApexchart'), {
  ssr: false,
});

import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import SelectRoutes from '@/components/SelectRoutes';
import CheckBoxDropdown from '@/components/ui/CheckBoxDropdown';
import SelectCustomDate from '@/components/SelectCustomDate';
import ArrestsToggleMap from '@/components/ArrestsToggleMap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


const STAT_TYPE = 'arrest';
const TRANSPORT_TYPE = 'bus';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];

function Rail() {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  const dateDropdownRef = useRef(null);
  const targetRef = useRef(null);
  const targetMaleRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [comments, setComments] = useState({});
  const [dateData, setDateData] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [pieData, setPieData] = useState({});
  const [published, setPublished] = useState(true);
  const [sectionVisibility, setSectionVisibility] = useState({
    femaleCategoryPie: false,
    femaleCategoryLine: false,
    maleCategoryPie: false,
    maleCategoryLine: false,
    agencywideAnalysisBar: false,
    agencywideAnalysisLine: false
  });

  const searchData = searchParams.get('line');
  const publishType = searchParams.get('published');

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  let totalSelectedDates = [];
  let latestDate = null;
  if (thisMonth.length) {
    latestDate = dayjs(thisMonth).format('MMMM YYYY');
    localStorage.setItem('latestDate', latestDate);
  }

  if (dateData) {
    dateData?.forEach((dateObj) => {
      if (dateObj.hasOwnProperty('selectedMonths')) {
        totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedMonths];
      }
    });
  }

  //check publish flag in url
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
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathName]);

  useEffect(() => {
    if (!isDateDropdownOpen) return;
  
    function handleClick(e) {
      if (isDateDropdownOpen && !dateDropdownRef.current?.contains(e.target)) {
        setIsDateDropdownOpen(false);
      }
    }
  
    if (typeof window !== "undefined") {
      window.addEventListener('click', handleClick);
    }
  
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('click', handleClick);
      }
    };
  }, [isDateDropdownOpen]);

  useEffect(() => {

    async function fetchDates() {
      const result = await fetchTimeRange(STAT_TYPE, TRANSPORT_TYPE, published);

      setIsDateDropdownOpen(false);
      setDateData(result?.dates);
      setIsYearDropdownOpen(() => {
        const newIsYearDropdownOpen = {};

        result?.dates.forEach((dateObj) => {
          newIsYearDropdownOpen[dateObj.year] = {
            active: false
          };
        });

        return newIsYearDropdownOpen;
      });

      thisMonth = result.thisMonth;
      previousMonth = result.previousMonth;
      lastQuarter = result.lastQuarter;
    }

    fetchDates();
  }, []);

  async function fetchPieChart(gender) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_name: searchData !== 'all' ? searchData : '',
          transport_type: TRANSPORT_TYPE,
          gender: gender,
          dates: totalSelectedDates2,
          published: published,
          graph_type: 'pie',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      setPieData((prevPieData) => {
        const newPieDataState = { ...prevPieData };
        newPieDataState[gender] = data['arrest_pie_data'];

        return newPieDataState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchLineChart(gender) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_name: searchData !== 'all' ? searchData : '',
          transport_type: TRANSPORT_TYPE,
          gender: gender,
          dates: totalSelectedDates2,
          published: published,
          graph_type: 'line',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      const transformedData =
        data['arrest_line_data'] &&
        data['arrest_line_data']
          .sort((a, b) => new Date(a.name) - new Date(b.name))
          .map((item) => {
            return {
              ...item,
              name: dayjs(item.name).format('MMM YY')
            };
          });

      setLineChartData((prevLineState) => {
        const newLineChartState = { ...prevLineState };
        newLineChartState[gender] = transformedData;

        return newLineChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAgencyWideBarChart() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_name: searchData !== 'all' ? searchData : '',
          transport_type: TRANSPORT_TYPE,
          dates: totalSelectedDates2,
          published: published,
          graph_type: 'bar',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();

      setBarData((prevBarDataState) => {
        const newBarDataState = { ...prevBarDataState };
        newBarDataState['arrest_agency_wide_bar'] = data['arrest_agency_wide_bar'];

        return newBarDataState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAgencyWideLineChart() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          line_name: searchData !== 'all' ? searchData : '',
          dates: totalSelectedDates2,
          transport_type: TRANSPORT_TYPE,
          published: published,
          graph_type: 'line',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      const transformedData =
        data['arrest_agency_wide_line'] &&
        data['arrest_agency_wide_line'].map((item) => {
          return {
            ...item,
            name: dayjs(item.name).format('MMM YY')
          };
        });

      setLineAgencyChartData((prevLineState) => {
        const newLineChartState = { ...prevLineState };
        newLineChartState['arrest_agency_wide_line'] = transformedData;

        return newLineChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (dateData.length === 0 || searchData === '') {
      return;
    }

    fetchPieChart('female');
    fetchPieChart('male');

    fetchLineChart('female');
    fetchLineChart('male');

    fetchAgencyWideBarChart();
    fetchAgencyWideLineChart();
  }, [dateData, searchData]);

  const [filters, setFilters] = useState({
    crime_name: [],
    station_name: [],
    crime_against: [],
    line_name: []
  });
  const [vettedRoute, setVettedRouteName] = useState([]);
  const [totalSelectedDates2, setTotalSelectedDates2] = useState([]);
  async function fetchArrestsCategories(categoryName) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/categories`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          category_name: categoryName,
          transport_type: TRANSPORT_TYPE,
          published: true,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      if (categoryName === 'line_name') {
        setVettedRouteName(data['arrest_categories'].sort((a, b) => a.localeCompare(b)));
      }
    } catch (error) {
      console.log("errrorrr", error);
    }
  }
  useEffect(() => {
    fetchArrestsCategories('line_name');
  }, [])

  useEffect(() => {
    if (filters.line_name.length > 0) {
      fetchPieChart('female');
      fetchPieChart('male');

      fetchLineChart('female');
      fetchLineChart('male');

      fetchAgencyWideBarChart();
      fetchAgencyWideLineChart();


    } else {
      fetchPieChart('female');
      fetchPieChart('male');

      fetchLineChart('female');
      fetchLineChart('male');

      fetchAgencyWideBarChart();
      fetchAgencyWideLineChart();
    }
  }, [filters])

  useEffect(() => {
    if (totalSelectedDates2.length > 0) {
      fetchPieChart('female');
      fetchPieChart('male');
      fetchLineChart('female');
      fetchLineChart('male');
      fetchAgencyWideBarChart();
      fetchAgencyWideLineChart('female');
    }
  }, [totalSelectedDates2])

  const handleVettedFilterChange = (name, selected) => {
    setFilters((prev) => ({ ...prev, [name]: selected }));
  };

  return (
    <>
      <div className="w-100">
        <div className="d-flex gap-3 justify-content-end w-100">
          <CheckBoxDropdown name={'line_name'} options={vettedRoute} label={'Route'} onChange={handleVettedFilterChange} uniqueId="arrestsbus1" />
          <SelectCustomDate vetted={true} stat_type={'arrest'} transport_type={'bus'} published={true} setTotalSelectedDates2={setTotalSelectedDates2} />
        </div>
      </div>

      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          {/* <h5 className="mb-3 metro__main-title mt-3">Female </h5> */}
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="female-tooltip">
                Count of persons arrested identified as Female.
              </Tooltip>
            }
            container={targetRef.current || undefined}
            containerPadding={20}
          >
            <h5
              className="mb-3 metro__main-title mt-3"
              ref={targetRef}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              Female
            </h5>
          </OverlayTrigger>
        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div className="w-100 mt-4 bg-white metro__section-card">
            <Suspense fallback={<Loader />}>{pieData.female && <PieApexchart chartData={pieData.female} />}</Suspense>
          </div>
        </div>
        <div className='col-md-8'>
          <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            <Suspense fallback={<Loader />}>{lineChartData.female && <ReactApexchartLine chartData1={lineChartData.female} height={405} />}</Suspense>

          </div>
        </div>
      </div>


      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          {/* <h5 className="mb-3 metro__main-title mt-3">Male </h5> */}
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="female-tooltip">
                Count of persons arrested identified as Male.
              </Tooltip>
            }
            container={targetMaleRef.current || undefined}
            containerPadding={20}
          >
            <h5
              className="mb-3 metro__main-title mt-3"
              ref={targetMaleRef}
              style={{ cursor: 'pointer', display: 'inline-block' }}
            >
              Male
            </h5>
          </OverlayTrigger>
        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div className="w-100 mt-4 bg-white metro__section-card">
            <Suspense fallback={<Loader />}>{pieData.male && <PieApexchart chartData={pieData.male} />}</Suspense>
          </div>
        </div>
        <div className='col-md-8'>
          <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            <Suspense fallback={<Loader />}>{lineChartData.male && <ReactApexchartLine chartData1={lineChartData.male} height={405} />}</Suspense>
          </div>
        </div>
      </div>

      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3 metro__main-title mt-3">Law Enforcement Analysis </h5>
          {/* {ucrData.agency_wide && ucrData.agency_wide.allUcrs && (
                <ButtonGroup>
                  <ToggleButton
                    key="all"
                    id="radio-agency-all"
                    type="radio"
                    variant={ucrData.agency_wide.selectedUcr === '' ? 'primary' : 'outline-secondary'}
                    name="agencyCrimeType"
                    value=""
                    checked={ucrData.agency_wide.selectedUcr === ''}
                    onChange={() => handleCrimeCategoryChange('agency_wide', '')}
                  >
                    All
                  </ToggleButton>

                  {ucrData.agency_wide.allUcrs.map((ucr, idx) => (
                    <ToggleButton
                      key={ucr}
                      id={`radio-agency-${idx}`}
                      type="radio"
                      variant={ucrData.agency_wide.selectedUcr === ucr ? 'primary' : 'outline-secondary'}
                      name="agencyCrimeType"
                      value={ucr}
                      checked={ucrData.agency_wide.selectedUcr === ucr}
                      onChange={() => handleCrimeCategoryChange('agency_wide', ucr)}
                    >
                      {ucr}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              )} */}

        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div className="w-100 mt-4 bg-white metro__section-card">
            {barData.arrest_agency_wide_bar && <ReactApexchartBar2 chartData1={barData.arrest_agency_wide_bar} height={373} />}
          </div>
        </div>
        <div className='col-md-8'>
          <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            {lineAgencyChartData.arrest_agency_wide_line && <ReactApexchartLine chartData1={lineAgencyChartData.arrest_agency_wide_line} height={405} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Rail;
