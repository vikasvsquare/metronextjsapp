'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchAllLines, fetchTimeRange } from '@/lib/action';

import ApexLineChart from '@/components/charts/ApexLineChart';
import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import LineChats from '@/components/charts/LineChats';
import Loader from '@/components/ui/loader';
// import SideBar from '@/components/SideBar';
import LineChartLegend from '@/components/ui/LineChartLegend';
import ReactApexchartLine from '@/components/charts/ReactApexchartLine';
import ReactApexchartBar2 from '@/components/charts/ReactApexchartBar2';
import ReactApexchart from '@/components/charts/ReactApexchart';
import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import SelectRoutes from '@/components/SelectRoutes';
import CheckBoxDropdown from '@/components/ui/CheckBoxDropdown';
import SelectCustomDate from '@/components/SelectCustomDate';

const STAT_TYPE = 'call_for_service';
const TRANSPORT_TYPE = 'bus';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];

function Bus() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [comments, setComments] = useState({});
  const [dateData, setDateData] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [routeData, setRouteData] = useState([]);
  const [ucrData, setUcrData] = useState({});
  const [published, setPublished] = useState(true);
  const [sectionVisibility, setSectionVisibility] = useState({
    callsClassificationBar: false,
    callsClassificationLine: false,
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
    window.scrollTo(0, 0);
  }, [pathName]);

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


  async function fetchBarChart(section) {
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
          dates: totalSelectedDates2,
          severity: section,
          published: published,
          graph_type: 'bar',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      setBarData((prevBarData) => {
        const newBarChartState = { ...prevBarData };
        newBarChartState[section] = data['call_for_service_bar_data'];

        return newBarChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchLineChart(section) {
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
          dates: totalSelectedDates2,
          severity: section,
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
        data['call_for_service_line_data'] &&
        data['call_for_service_line_data']
          .sort((a, b) => new Date(a.name) - new Date(b.name))
          .map((item) => {
            return {
              ...item,
              name: dayjs(item.name).format('MMM YY')
            };
          });

      setLineChartData((prevLineState) => {
        const newBarChartState = { ...prevLineState };
        newBarChartState[section] = transformedData;

        return newBarChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAgencyWideBarChart(section) {
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
          // severity: section,
          published: published,
          graph_type: 'bar',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();

      setBarData((prevBarData) => {
        const newBarChartState = { ...prevBarData };
        newBarChartState[section] = data['call_for_service_agency_wide_bar'];

        return newBarChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAgencyWideLineChart(section) {
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
        data['call_for_service_agency_wide_line'] &&
        data['call_for_service_agency_wide_line'].map((item) => {
          return {
            ...item,
            name: dayjs(item.name).format('MMM YY')
          };
        });

      setLineAgencyChartData((prevLineState) => {
        const newBarChartState = { ...prevLineState };
        newBarChartState[section] = transformedData;

        return newBarChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (dateData.length === 0 || searchData === '') {
      return;
    }
    fetchBarChart('calls_classification');
    fetchLineChart('calls_classification');
    fetchAgencyWideBarChart('agency_wide');
    fetchAgencyWideLineChart('agency_wide');
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
        setVettedRouteName(data['arrest_categories']);
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
      fetchBarChart('calls_classification');
      fetchLineChart('calls_classification');
      fetchAgencyWideBarChart('agency_wide');
      fetchAgencyWideLineChart('agency_wide');
    } else {
      fetchBarChart('calls_classification');
      fetchLineChart('calls_classification');
      fetchAgencyWideBarChart('agency_wide');
      fetchAgencyWideLineChart('agency_wide');
    }
  }, [filters])

  useEffect(() => {
    if (totalSelectedDates2.length > 0) {
      fetchBarChart('calls_classification');
      fetchLineChart('calls_classification');
      fetchAgencyWideBarChart('agency_wide');
      fetchAgencyWideLineChart('agency_wide');
    }
  }, [totalSelectedDates2])

  const handleVettedFilterChange = (name, selected) => {
    setFilters((prev) => ({ ...prev, [name]: selected }));
  };

  return (
    <>
      <div className="w-100">
        <div className="d-flex gap-3 justify-content-end w-100">
          <CheckBoxDropdown name={'line_name'} options={vettedRoute} label={'Select Route'} onChange={handleVettedFilterChange} />
          <SelectCustomDate vetted={true} stat_type={'arrest'} transport_type={'systemwide'} published={true} setTotalSelectedDates2={setTotalSelectedDates2} />
        </div>
      </div>

      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3 metro__main-title mt-3">Calls Classification </h5>
        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div className="w-100 mt-4 bg-white metro__section-card">
            {barData.calls_classification && <ReactApexchartBar2 chartData1={barData.calls_classification} />}
          </div>
        </div>
        <div className='col-md-8'>
          <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            {lineChartData.calls_classification && <ReactApexchartLine chartData1={lineChartData.calls_classification} height={405} />}
          </div>
        </div>
      </div>


      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3 metro__main-title mt-3">Law Enforcement Analysis </h5>
        </Col>
      </div>
      <div className='row'>
        <div className='Bar-Graph  col-md-4'>
          <div className="w-100 mt-4 bg-white metro__section-card">
            <Suspense fallback={<Loader />}>{barData.agency_wide && <ReactApexchartBar2 chartData1={barData.agency_wide} height={373} />}</Suspense>
          </div>
        </div>
        <div className='col-md-8'>
          <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
            {lineAgencyChartData.agency_wide && <ReactApexchartLine chartData1={lineAgencyChartData.agency_wide} height={405} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Bus;
