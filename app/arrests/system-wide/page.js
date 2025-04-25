'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchTimeRange } from '@/lib/action';

import BarCharts from '@/components/charts/BarCharts';
import CustomModal from '@/components/ui/Modal';
import LineChartLegend from '@/components/ui/LineChartLegend';
import Loader from '@/components/ui/loader';
import PieApexchart from '@/components/charts/PieApexchart';
import ApexLineChart from '@/components/charts/ApexLineChart';
import ReactApexchartLine from '@/components/charts/ReactApexchartLine';
import ReactApexchartBar2 from '@/components/charts/ReactApexchartBar2';
import { Container, Row, Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import SelectRoutes from '@/components/SelectRoutes';

const STAT_TYPE = 'arrest';
const TRANSPORT_TYPE = 'systemwide';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];

function SystemWide() {
  const dateDropdownRef = useRef(null);
  const pathName = usePathname();
  const searchParams = useSearchParams();
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
  const publishType = searchParams.get('published');

  const [sectionVisibility, setSectionVisibility] = useState({
    femaleCategoryPie: false,
    femaleCategoryLine: false,
    maleCategoryPie: false,
    maleCategoryLine: false,
    agencywideAnalysisBar: false,
    agencywideAnalysisLine: false
  });

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

  useEffect(() => {
    if (dateData.length === 0) {
      return;
    }

    async function fetchComments(section) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/comment`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            line_name: 'all',
            dates: totalSelectedDates,
            section: section,
            transport_type: 'systemwide',
            published: published
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();

        setComments((prevCommentsState) => {
          const newCommentsState = { ...prevCommentsState };
          newCommentsState[section] = data.comment;

          return newCommentsState;
        });
      } catch (error) {
        console.log(error);
      }
    }

    // fetchComments('female_category');
    // fetchComments('male_category');
    // fetchComments('agency_wide');

    async function fetchPieChart(gender) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gender: gender,
            dates: totalSelectedDates,
            published: published,
            graph_type: 'pie'
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

    fetchPieChart('female');
    fetchPieChart('male');

    async function fetchLineChart(gender) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gender: gender,
            dates: totalSelectedDates,
            published: published,
            graph_type: 'line'
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

    fetchLineChart('female');
    fetchLineChart('male');

    async function fetchAgencyWideBarChart() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dates: totalSelectedDates,
            published: published,
            graph_type: 'bar'
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

    fetchAgencyWideBarChart();

    async function fetchAgencyWideLineChart() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data/agency`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dates: totalSelectedDates,
            published: published,
            graph_type: 'line'
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

    fetchAgencyWideLineChart();
  }, [dateData]);

  function handleDateDropdownClick() {
    setIsDateDropdownOpen((prevDatePickerState) => {
      return !prevDatePickerState;
    });
  }

  function handleYearDropdownClick(year, shouldOpen) {
    setIsYearDropdownOpen((prevIsYearDropdownOpen) => {
      const newIsYearDropdownOpen = { ...prevIsYearDropdownOpen };
      newIsYearDropdownOpen[year].active = shouldOpen;
      return newIsYearDropdownOpen;
    });
  }

  function handleYearCheckboxClick(e, year, months) {
    if (e.target.checked) {
      const dates = months.map((month, index) => {
        const monthIndex = (MONTH_NAMES.indexOf(month)) + 1;
        return `${year}-${monthIndex}-1`;
      });

      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            dateObj.selectedMonths = [...dates];
          }
        });

        return newDateData;
      });
    } else {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            dateObj.selectedMonths = [];
          }
        });

        return newDateData;
      });
    }
  }

  function handleMonthCheckboxClick(e, date) {
    const year = date.split('-')[0];

    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (!dateObj.hasOwnProperty('selectedMonths')) {
              dateObj.selectedMonths = [];
            }

            if (dateObj.selectedMonths.indexOf(date) === -1) {
              dateObj.selectedMonths.push(date);
            }
          }
        });

        return newDateData;
      });
    } else {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (dateObj.hasOwnProperty('selectedMonths')) {
              if (dateObj.selectedMonths.indexOf(date) > -1) {
                dateObj.selectedMonths.splice(dateObj.selectedMonths.indexOf(date), 1);
              }
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleMonthFilterClick(datesArr) {
    setDateData((prevDateData) => {
      const newDateData = [...prevDateData];

      newDateData.forEach((dateObj) => {
        dateObj.selectedMonths = [];

        datesArr.forEach((date) => {
          const [year] = date.split('-');

          if (dateObj.year === year) {
            dateObj.selectedMonths.push(date);
          }
        });
      });

      return newDateData;
    });
  }

  function handleOpenModal(name) {
    setSectionVisibility((prevState) => ({
      ...prevState,
      [name]: !prevState[name]
    }));
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setSectionVisibility({
      femaleCategoryPie: false,
      femaleCategoryLine: false,
      maleCategoryPie: false,
      maleCategoryLine: false,
      agencywideAnalysisBar: false,
      agencywideAnalysisLine: false
    });
  }

  function getModalTitle() {
    if (sectionVisibility.femaleCategoryPie || sectionVisibility.femaleCategoryLine) {
      return 'Female';
    } else if (sectionVisibility.maleCategoryPie || sectionVisibility.maleCategoryLine) {
      return 'Male';
    } else if (sectionVisibility.agencywideAnalysisBar || sectionVisibility.agencywideAnalysisLine) {
      return 'Law Enforcement Analysis';
    } else {
      return '';
    }
  }

  return (
    <>
       {/* <div className="d-flex flex-column gap-2">
        <SelectRoutes vetted1={true} transport1='system-wide' stat_type1='arrest' />
      </div> */}

      <div className="align-items-center d-flex items-center justify-between mt-3">
        <Col md={6} className="mb-3 mb-md-0">
          <h5 className="mb-3 metro__main-title mt-3">Female </h5>
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
          <h5 className="mb-3 metro__main-title mt-3">Male </h5>
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

export default SystemWide;
