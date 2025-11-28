'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import equal from 'array-equal';
import dayjs from 'dayjs';

import { fetchTimeRange, fetchUnvettedTimeRange, getUCR } from '@/lib/action';

import Loader from '@/components/ui/loader';
import { Col, ButtonGroup, ToggleButton, Dropdown } from 'react-bootstrap';

import dynamic from 'next/dynamic';
const ReactApexchartBar2 = dynamic(() => import('@/components/charts/ReactApexchartBar2'), {
  ssr: false,
});
const ReactApexchartLine = dynamic(() => import('@/components/charts/ReactApexchartLine'), {
  ssr: false,
});
const IncidentLineChart = dynamic(() => import('@/components/charts/IncidentLineChart'), {
  ssr: false,
});

import CheckBoxDropdown from '@/components/ui/CheckBoxDropdown';
import SelectCustomDate from '@/components/SelectCustomDate';
import { getStartDateOfWeek } from '../utils/dateUtils';
import AvgByCategoryChart from '@/components/charts/AvgByCategoryChart';
import AvgByAgencyMonthlyChart from '@/components/charts/AvgByAgencyMonthlyChart';

const STAT_TYPE = 'crime';
const TRANSPORT_TYPE = 'systemwide';
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let thisMonth = [];
let previousMonth = [];
let lastQuarter = [];
let thisWeek = [];
let previousWeek = [];
let lastFourWeeks = [];

const jsonData = [
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "37.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "20.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "16.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "13.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "16.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "44.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "21.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "15.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "15.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "17.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "15.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "9.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "32.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "20.45",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "9.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "6.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "3.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "17.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.74",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.48",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "2.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "4.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "14.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "15.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "13.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "3.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.56",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "3.72",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "4.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "1.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "4.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "3.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "16.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "13.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "3.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "8.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "8.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "7.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "7.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "8.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "7.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "6.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "3.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "8.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "7.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "13.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "6.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "4.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "1.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "14.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "8.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "6.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "3.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "8.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "8.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "8.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "5.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "8.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "13.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "6.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.55",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.68",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "13.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "13.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "14.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "15.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "8.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "3.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "13.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.23",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.85",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "9.75",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "14.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "8.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "10.40",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "11.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "9.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "14.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "16.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.37",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "5.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "12.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "10.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "4.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "16.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "15.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "12.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "6.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "17.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "11.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.44",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "13.85",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "13.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "7.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "priority",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lapd",
    "incident_category": "emergency",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "27.44",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "16.87",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.45",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "26.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.23",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.04",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.85",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "20.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.23",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "23.78",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.75",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.19",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "10.67",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "15.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.97",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.21",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.88",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.36",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.69",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "3.96",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "24.08",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.37",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.76",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "23.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.61",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.76",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.78",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "28.94",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.55",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "24.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.44",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.48",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "26.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.03",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.72",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.46",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "23.27",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "27.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.67",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "27.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.73",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.97",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "25.12",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.89",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "31.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.73",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "29.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.82",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.12",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "31.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.03",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.85",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.51",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "15.73",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.42",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "15.66",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.78",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.88",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "18.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "10.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "23.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "10.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.15",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.46",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "20.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.91",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "20.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "9.32",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "20.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "24.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "9.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "17.86",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "9.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "26.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "10.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "18.82",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "9.94",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.16",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.04",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "9.96",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "17.97",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.56",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.76",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.47",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.48",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.97",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.68",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.45",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "10.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "18.86",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "10.28",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.83",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "17.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "9.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.74",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "14.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "8.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "4.55",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.22",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.65",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.97",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "30.72",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "23.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.29",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "16.93",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "10.45",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "20.62",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "24.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "17.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.74",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.97",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.15",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "17.16",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.65",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "15.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.32",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.86",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "23.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.91",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "20.59",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "11.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.84",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.84",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "22.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "26.19",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.74",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "33.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "9.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "25.61",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "38.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.15",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.96",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "35.66",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.69",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "27.08",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.69",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.04",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "32.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "24.22",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "47.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "18.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.96",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "39.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "21.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.56",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "32.72",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.57",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "35.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "9.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "35.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.46",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "40.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.67",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "44.02",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.12",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "7.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "34.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.78",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "38.56",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.44",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "36.27",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "12.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.45",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "36.01",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.19",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "29.27",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.02",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "31.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.47",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "5.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "34.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "13.65",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "6.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "24.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "15.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": "26.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": "14.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": "8.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "routine",
    "incident_response_time": null,
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "priority",
    "incident_response_time": null,
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lasd",
    "incident_category": "emergency",
    "incident_response_time": null,
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "1.16",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.67",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-07-31T18:30:00.000Z",
    "year": 2017,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.86",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.52",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-11-30T18:30:00.000Z",
    "year": 2017,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.68",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.91",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-06-30T18:30:00.000Z",
    "year": 2017,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.86",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-10-31T18:30:00.000Z",
    "year": 2017,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.46",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "8.08",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-09-30T18:30:00.000Z",
    "year": 2017,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.37",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-08-31T18:30:00.000Z",
    "year": 2017,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "8.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-03-31T18:30:00.000Z",
    "year": 2018,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.21",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.98",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-07-31T18:30:00.000Z",
    "year": 2018,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.12",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.74",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-11-30T18:30:00.000Z",
    "year": 2018,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.12",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-01-31T18:30:00.000Z",
    "year": 2018,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "10.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.84",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2017-12-31T18:30:00.000Z",
    "year": 2018,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.62",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.98",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-06-30T18:30:00.000Z",
    "year": 2018,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.23",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-05-31T18:30:00.000Z",
    "year": 2018,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.87",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "14.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.65",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-02-28T18:30:00.000Z",
    "year": 2018,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.68",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-04-30T18:30:00.000Z",
    "year": 2018,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.88",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.08",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-10-31T18:30:00.000Z",
    "year": 2018,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.15",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.52",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-09-30T18:30:00.000Z",
    "year": 2018,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.84",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.85",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.48",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-08-31T18:30:00.000Z",
    "year": 2018,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "2.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-03-31T18:30:00.000Z",
    "year": 2019,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "1.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.82",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-07-31T18:30:00.000Z",
    "year": 2019,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "8.71",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-11-30T18:30:00.000Z",
    "year": 2019,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.34",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-01-31T18:30:00.000Z",
    "year": 2019,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "1.10",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.93",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2018-12-31T18:30:00.000Z",
    "year": 2019,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.65",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-06-30T18:30:00.000Z",
    "year": 2019,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-05-31T18:30:00.000Z",
    "year": 2019,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.85",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "0.98",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.72",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-02-28T18:30:00.000Z",
    "year": 2019,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.08",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.04",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-04-30T18:30:00.000Z",
    "year": 2019,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "1.84",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.22",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-10-31T18:30:00.000Z",
    "year": 2019,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.16",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.21",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-09-30T18:30:00.000Z",
    "year": 2019,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.82",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-08-31T18:30:00.000Z",
    "year": 2019,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.37",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.56",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-03-31T18:30:00.000Z",
    "year": 2020,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.72",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.27",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-07-31T18:30:00.000Z",
    "year": 2020,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "0.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.21",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-11-30T18:30:00.000Z",
    "year": 2020,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.34",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "1.88",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.28",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-01-31T18:30:00.000Z",
    "year": 2020,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.19",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "10.57",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "2.90",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2019-12-31T18:30:00.000Z",
    "year": 2020,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "1.78",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "10.02",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.71",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-06-30T18:30:00.000Z",
    "year": 2020,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.03",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.15",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-05-31T18:30:00.000Z",
    "year": 2020,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-02-29T18:30:00.000Z",
    "year": 2020,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "1.83",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.48",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.32",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-04-30T18:30:00.000Z",
    "year": 2020,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-10-31T18:30:00.000Z",
    "year": 2020,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "1.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "9.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-09-30T18:30:00.000Z",
    "year": 2020,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "1.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-08-31T18:30:00.000Z",
    "year": 2020,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.22",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.21",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.46",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-03-31T18:30:00.000Z",
    "year": 2021,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.17",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-07-31T18:30:00.000Z",
    "year": 2021,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.52",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.28",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-11-30T18:30:00.000Z",
    "year": 2021,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.59",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.98",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.25",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-01-31T18:30:00.000Z",
    "year": 2021,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "14.60",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.26",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2020-12-31T18:30:00.000Z",
    "year": 2021,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.91",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.41",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-06-30T18:30:00.000Z",
    "year": 2021,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.58",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.55",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "2.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-05-31T18:30:00.000Z",
    "year": 2021,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.57",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.26",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-02-28T18:30:00.000Z",
    "year": 2021,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.11",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.78",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.16",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-04-30T18:30:00.000Z",
    "year": 2021,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.76",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.36",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-10-31T18:30:00.000Z",
    "year": 2021,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.84",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.93",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-09-30T18:30:00.000Z",
    "year": 2021,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "7.08",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-08-31T18:30:00.000Z",
    "year": 2021,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.70",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.35",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.04",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-03-31T18:30:00.000Z",
    "year": 2022,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.22",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.48",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-07-31T18:30:00.000Z",
    "year": 2022,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.32",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.67",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.47",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-11-30T18:30:00.000Z",
    "year": 2022,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.19",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.99",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.81",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-01-31T18:30:00.000Z",
    "year": 2022,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.75",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.88",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.63",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2021-12-31T18:30:00.000Z",
    "year": 2022,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.59",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.26",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.46",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-06-30T18:30:00.000Z",
    "year": 2022,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "4.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.07",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-05-31T18:30:00.000Z",
    "year": 2022,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "1.83",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-02-28T18:30:00.000Z",
    "year": 2022,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.21",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.86",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-04-30T18:30:00.000Z",
    "year": 2022,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.56",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-10-31T18:30:00.000Z",
    "year": 2022,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "3.80",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-09-30T18:30:00.000Z",
    "year": 2022,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "12.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.79",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-08-31T18:30:00.000Z",
    "year": 2022,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.51",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.89",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.67",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-03-31T18:30:00.000Z",
    "year": 2023,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.91",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.37",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.92",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-07-31T18:30:00.000Z",
    "year": 2023,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.37",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "1.83",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.87",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-11-30T18:30:00.000Z",
    "year": 2023,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.32",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-01-31T18:30:00.000Z",
    "year": 2023,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.52",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "2.29",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2022-12-31T18:30:00.000Z",
    "year": 2023,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "11.87",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.69",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-06-30T18:30:00.000Z",
    "year": 2023,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "4.02",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.87",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.15",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-05-31T18:30:00.000Z",
    "year": 2023,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.22",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "8.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-02-28T18:30:00.000Z",
    "year": 2023,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.20",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.73",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.13",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-04-30T18:30:00.000Z",
    "year": 2023,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.34",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.64",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "6.62",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-10-31T18:30:00.000Z",
    "year": 2023,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.49",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "6.30",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-09-30T18:30:00.000Z",
    "year": 2023,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.54",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.34",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.36",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-08-31T18:30:00.000Z",
    "year": 2023,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "4.02",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.45",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.66",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-03-31T18:30:00.000Z",
    "year": 2024,
    "month": "apr",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "8.69",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.18",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-07-31T18:30:00.000Z",
    "year": 2024,
    "month": "aug",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "9.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.29",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-11-30T18:30:00.000Z",
    "year": 2024,
    "month": "dec",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.50",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.68",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-01-31T18:30:00.000Z",
    "year": 2024,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.65",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.43",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "7.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2023-12-31T18:30:00.000Z",
    "year": 2024,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "4.19",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "0.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.28",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-06-30T18:30:00.000Z",
    "year": 2024,
    "month": "jul",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.95",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.09",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-05-31T18:30:00.000Z",
    "year": 2024,
    "month": "jun",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.05",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.16",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.61",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-02-29T18:30:00.000Z",
    "year": 2024,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.62",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "0.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "7.06",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-04-30T18:30:00.000Z",
    "year": 2024,
    "month": "may",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "4.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "7.39",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "4.42",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-10-31T18:30:00.000Z",
    "year": 2024,
    "month": "nov",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "4.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "3.31",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "6.38",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-09-30T18:30:00.000Z",
    "year": 2024,
    "month": "oct",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.04",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "6.82",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "5.01",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-08-31T18:30:00.000Z",
    "year": 2024,
    "month": "sep",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "2.53",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "5.77",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "6.01",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-01-31T18:30:00.000Z",
    "year": 2025,
    "month": "feb",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.82",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": "4.24",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": "7.00",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2024-12-31T18:30:00.000Z",
    "year": 2025,
    "month": "jan",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": "3.33",
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "routine",
    "incident_response_time": null,
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "priority",
    "incident_response_time": null,
    "transport_type": null,
    "line": null,
    "station": null
  },
  {
    "year_month": "2025-02-28T18:30:00.000Z",
    "year": 2025,
    "month": "mar",
    "agency": "lbpd",
    "incident_category": "emergency",
    "incident_response_time": null,
    "transport_type": null,
    "line": null,
    "station": null
  }
];
function IncidentResponseTime() {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const dateDropdownRef = useRef(null);

  const [barData, setBarData] = useState({});
  const [lineData, setLineData] = useState({});
  const [dateData, setDateData] = useState([]);
  const [totalSelectedDates1, setTotalSelectedDates] = useState([]);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState([]);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState([]);
  const [lineAgencyChartData, setLineAgencyChartData] = useState({});
  const [sectionVisibility, setSectionVisibility] = useState({
    agencyBar: false,
    agencyLine: false,
    systemWideBar: false,
    systemWideLine: false,
    violentBar: false,
    violentLine: false
  });
  const [lineWeeklyData, setLineWeeklyData] = useState({});
  const [ucrData, setUcrData] = useState({});
  const [vetted, setVetted] = useState(true);
  const [published, setPublished] = useState(true);
  const vettedType = searchParams.get('vetted');
  const publishType = searchParams.get('published');

  let totalSelectedDates = [];
  let latestDate = null;

  useEffect(() => {
    if (vetted && thisMonth?.length) {
      latestDate = dayjs(thisMonth).format('MMMM YYYY');
      localStorage.setItem('latestDate', latestDate);
    } else if (!vetted && thisWeek.length) {
      latestDate = dayjs([thisWeek[0].slice(0, -3)]).format('MMMM YYYY');
      localStorage.setItem('latestDate', latestDate);
    }
  }, [vetted])


  useEffect(() => {
    if (dateData) {
      dateData?.forEach((dateObj) => {
        if (dateObj.hasOwnProperty('selectedMonths')) {
          totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedMonths];
          setTotalSelectedDates(totalSelectedDates);
        } else if (dateObj.hasOwnProperty('selectedWeeks')) {
          totalSelectedDates = [...totalSelectedDates, ...dateObj.selectedWeeks];
          setTotalSelectedDates(totalSelectedDates);
        }
      });
    }

  }, [dateData])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathName]);

  useEffect(() => {
    if (vettedType && vettedType === "false") {
      setVetted(false);
    }
    if (vettedType && vettedType === "true") {
      setVetted(true);
    }
  }, [vettedType])

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
      if (vetted) {
        const result = await fetchTimeRange(STAT_TYPE, TRANSPORT_TYPE, published, vetted);

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

        thisMonth = result?.thisMonth;
        previousMonth = result?.previousMonth;
        lastQuarter = result?.lastQuarter;
      } else {
        const result = await fetchUnvettedTimeRange(TRANSPORT_TYPE, published);

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
        setIsMonthDropdownOpen(() => {
          const newIsMonthDropdownOpen = {};

          result?.dates.forEach((dateObj) => {
            dateObj.months.forEach((month) => {
              if (!newIsMonthDropdownOpen.hasOwnProperty(dateObj.year)) {
                newIsMonthDropdownOpen[dateObj.year] = {};
              }

              newIsMonthDropdownOpen[dateObj.year][month] = {
                active: false
              };
            });
          });

          return newIsMonthDropdownOpen;
        });


        thisWeek = result?.thisWeek ? result?.thisWeek : [];
        previousWeek = result?.previousWeek ? result?.previousWeek : [];
        lastFourWeeks = result?.lastFourWeeks ? result?.lastFourWeeks.reverse() : [];
      }
    }
    fetchDates();

    async function fetchUCR(severity) {
      const result = await getUCR(STAT_TYPE, TRANSPORT_TYPE, vetted, severity);

      if (result.length) {
        setUcrData((prevUcrState) => {
          const newUcrState = { ...prevUcrState };

          if (!newUcrState.hasOwnProperty(severity)) {
            newUcrState[severity] = {};
          }

          newUcrState[severity].allUcrs = result?.sort();
          newUcrState[severity].selectedUcr = '';

          return newUcrState;
        });
      }
    }

    // fetchUCR('violent_crime');
    fetchUCR('systemwide_crime');
    fetchUCR('agency_wide');
  }, [vetted, published]);

  async function fetchBarChart(section) {
    if (vetted) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vetted: vetted,
            dates: totalSelectedDates1,
            severity: section,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            published: published,
            graph_type: 'bar',
            filterData: filtersVetted
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        setBarData((prevBarData) => {
          const newBarChartState = { ...prevBarData };
          newBarChartState[section] = data['crime_bar_data'];

          return newBarChartState;
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      const weeksPerMonth = [];

      totalSelectedDates1.forEach((dateWeek, dateWeekIndex) => {
        const [year, month, day, week] = dateWeek.split('-');
        const date = `${year}-${month}-${day}`;

        if (!weeksPerMonth.hasOwnProperty(date)) {
          weeksPerMonth[date] = [];
        }

        if (week) {
          const strArray = week.split(',');
          const numbers = strArray.map(num => parseInt(num, 10));
          numbers.forEach(number => {
            weeksPerMonth[date].push(number);
          });
        }
      });

      const dates = [];

      for (const [key, value] of Object.entries(weeksPerMonth)) {
        dates.push({
          [key]: value
        });
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/data`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dates: dates,
            severity: section,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            published: published,
            graph_type: 'bar'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        setBarData((prevBarData) => {
          const newBarChartState = { ...prevBarData };
          newBarChartState[section] = data['crime_unvetted_bar_data'];

          return newBarChartState;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function fetchLineChart(section) {
    if (vetted) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/data`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            vetted: vetted,
            dates: totalSelectedDates1,
            severity: section,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            published: true,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['crime_line_data'] &&
          data['crime_line_data']
            .sort((a, b) => new Date(a.name) - new Date(b.name))
            .map((item) => {
              return {
                ...item,
                name: dayjs(item.name).format('MMM YY')
              };
            });

        setLineData((prevLineState) => {
          const newBarChartState = { ...prevLineState };
          newBarChartState[section] = transformedData;

          return newBarChartState;
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      const weeksPerMonth = {};

      totalSelectedDates1.forEach((dateWeek, dateWeekIndex) => {
        const [year, month, day, week] = dateWeek.split('-');
        const date = `${year}-${month}-${day}`;

        if (!weeksPerMonth.hasOwnProperty(date)) {
          weeksPerMonth[date] = [];
        }

        if (week) {
          const strArray = week.split(',');
          const numbers = strArray.map(num => parseInt(num, 10));
          numbers.forEach(number => {
            weeksPerMonth[date].push(number);
          });
        }
      });

      const dates = [];

      for (const [key, value] of Object.entries(weeksPerMonth)) {
        dates.push({
          [key]: value
        });
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/data`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dates: dates,
            severity: section,
            crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
            published: true,
            graph_type: 'line'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data!');
        }

        const data = await response.json();
        const transformedData =
          data['crime_unvetted_line_data'] &&
          data['crime_unvetted_line_data'].map((item) => {
            return {
              ...item,
              name: item.name
            };
          });

        setLineData((prevLineState) => {
          const newBarChartState = { ...prevLineState };
          newBarChartState[section] = transformedData;

          return newBarChartState;
        });
      } catch (error) {
        console.log(error);
      }
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
          vetted: vetted,
          dates: totalSelectedDates1,
          crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
          published: published,
          graph_type: 'bar',
          filterData: filtersVetted
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();

      setBarData((prevBarData) => {
        const newBarChartState = { ...prevBarData };
        newBarChartState[section] = data['agency_wide_bar_data'];

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
          dates: totalSelectedDates1,
          crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
          vetted: vetted,
          published: published,
          graph_type: 'line',
          filterData: filtersVetted
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }

      const data = await response.json();
      const transformedData =
        data['agency_wide_line_data'] &&
        data['agency_wide_line_data'].map((item) => {
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

  function handleMonthDropdownClick(year, month, shouldOpen) {
    setIsMonthDropdownOpen((prevIsMonthDropdownOpen) => {
      const newIsMonthDropdownOpen = { ...prevIsMonthDropdownOpen };
      newIsMonthDropdownOpen[year][month].active = shouldOpen;
      return newIsMonthDropdownOpen;
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
            if (vetted) {
              dateObj.selectedMonths = [...dates];
            } else {
              dateObj.selectedWeeks = [...dates];
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
            if (vetted) {
              dateObj.selectedMonths = [];
            } else {
              dateObj.selectedWeeks = [];
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleMonthCheckboxClick(e, date, weeksinThisMonth) {
    const year = date.split('-')[0];

    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (vetted && !dateObj.hasOwnProperty('selectedMonths')) {
              dateObj.selectedMonths = [];
            } else if (!vetted && !dateObj.hasOwnProperty('selectedWeeks')) {
              dateObj.selectedWeeks = [];
            }

            if (vetted && dateObj.selectedMonths.indexOf(date) === -1) {
              dateObj.selectedMonths.push(date);
            } else if (!vetted && dateObj.selectedWeeks.indexOf(date) === -1) {
              dateObj.selectedWeeks = weeksinThisMonth;
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
            if (vetted && dateObj.hasOwnProperty('selectedMonths')) {
              if (dateObj.selectedMonths.indexOf(date) > -1) {
                dateObj.selectedMonths.splice(dateObj.selectedMonths.indexOf(date), 1);
              }
            } else if (!vetted && dateObj.hasOwnProperty('selectedWeeks')) {
              dateObj.selectedWeeks = [];
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleWeekCheckboxClick(e, date) {
    const year = date.split('-')[0];

    if (e.target.checked) {
      setDateData((prevDateData) => {
        const newDateData = [...prevDateData];

        newDateData.forEach((dateObj) => {
          if (dateObj.year === year) {
            if (!dateObj.hasOwnProperty('selectedWeeks')) {
              dateObj.selectedWeeks = [];
            }

            if (dateObj.selectedWeeks.indexOf(date) === -1) {
              dateObj.selectedWeeks.push(date);
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
            if (dateObj.hasOwnProperty('selectedWeeks')) {
              if (dateObj.selectedWeeks.indexOf(date) > -1) {
                dateObj.selectedWeeks.splice(dateObj.selectedWeeks.indexOf(date), 1);
              }
            }
          }
        });

        return newDateData;
      });
    }
  }

  function handleCrimeCategoryChange(severity, crimeCategory) {
    setUcrData((prevUcrState) => {
      const newUcrState = { ...prevUcrState };
      newUcrState[severity].selectedUcr = crimeCategory;
      return newUcrState;
    });
  }


  // new enhancement 
  const [unvettedCrimeName, setUnvettedCrimeName] = useState([]);
  const [unvettedRoute, setUnvettedRouteNAme] = useState([]);
  const [vettedRoute, setVettedRouteName] = useState([]);
  const [unvettedStation, setUnvettedStation] = useState([]);
  const [unvettedLineName, setUnvettedLineName] = useState(['persons', 'property', 'society']);

  const [filters, setFilters] = useState({
    crime_name: [],
    station_name: [],
    crime_against: [],
    line_name: []
  });
  const [filtersVetted, setFiltersVetted] = useState({
    crime_name: [],
    station_name: [],
    crime_against: [],
    line_name: []
  });
  const [totalSelectedDates2, setTotalSelectedDates2] = useState([]);
  const isFirstRender = useRef(true);

  const isFirstVettedRender = useRef(true);

  async function fetchCrimeVettedCategories(categoryName) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/vetted/categories`, {
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
        setVettedRouteName(data['crime_vetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
      // if (categoryName === 'crime_name') {
      //   setVettedCrimeName(data['crime_vetted_categories']);
      // }
      // if (categoryName === 'station_name') {
      //   setVettedStation(data['crime_vetted_categories']);
      // }
    } catch (error) {
      console.log("errrorrr", error);
    }
  }
  async function fetchCrimeUnvettedCategories(categoryName) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/categories`, {
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
        setUnvettedRouteNAme(data['crime_unvetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
      if (categoryName === 'crime_name') {
        setUnvettedCrimeName(data['crime_unvetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
      if (categoryName === 'station_name') {
        setUnvettedStation(data['crime_unvetted_categories'].sort((a, b) => a.localeCompare(b)));
      }
    } catch (error) {
      console.log("errrorrr", error);
    }
  }

  useEffect(() => {
    fetchCrimeVettedCategories('line_name');
    fetchCrimeUnvettedCategories('crime_name');
    fetchCrimeUnvettedCategories('station_name');
    fetchCrimeUnvettedCategories('line_name');
  }, [])

  useEffect(() => {
    if (totalSelectedDates2.length === 0) return;
    fetchWeeklyLineChart('systemwide_crime');
  }, [totalSelectedDates2])

  // get systemwide crime Overview data 
  async function fetchWeeklyLineChart(section) {
    const weeksPerMonth = [];

    totalSelectedDates2.forEach((dateWeek, dateWeekIndex) => {
      const [year, month, day, week] = dateWeek.split('-');
      const date = `${year}-${month}-${day}`;

      if (!weeksPerMonth.hasOwnProperty(date)) {
        weeksPerMonth[date] = [];
      }

      if (week) {
        const strArray = week.split(',');
        const numbers = strArray.map(num => parseInt(num, 10));
        numbers.forEach(number => {
          weeksPerMonth[date].push(number);
        });
      }
    });

    const dates = [];

    for (const [key, value] of Object.entries(weeksPerMonth)) {
      dates.push({
        [key]: value
      });
    }
    if (dates.length === 0) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}${STAT_TYPE}/unvetted/data`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dates: dates,
          severity: section,
          crime_category: (ucrData[section] && ucrData[section].selectedUcr) || '',
          published: published,
          graph_type: 'line',
          filterData: filters
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data!');
      }
      const data = await response.json();

      const transformedData = data['crime_unvetted_line_data'].map(item => ({
        ...item,
        name: getStartDateOfWeek(item.name),
      }));

      setLineWeeklyData((prevBarData) => {
        const newBarChartState = { ...prevBarData };
        newBarChartState[section] = transformedData;
        return newBarChartState;
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // Skip first render
    }

    const hasAnyFilter =
      filters.crime_name.length > 0 ||
      filters.station_name.length > 0 ||
      filters.crime_against.length > 0 ||
      filters.line_name.length > 0;

    const hasAnyEmptyFilter =
      filters.crime_name.length === 0 ||
      filters.station_name.length === 0 ||
      filters.crime_against.length === 0 ||
      filters.line_name.length === 0;

    if (hasAnyFilter || hasAnyEmptyFilter) {
      fetchWeeklyLineChart('systemwide_crime');
    }
  }, [filters]);

  useEffect(() => {
    if (isFirstVettedRender.current) {
      isFirstVettedRender.current = false;
      return; // Skip first render
    }

    const hasAnyFilter =
      filtersVetted.crime_name.length > 0 ||
      filtersVetted.station_name.length > 0 ||
      filtersVetted.crime_against.length > 0 ||
      filtersVetted.line_name.length > 0;

    if (hasAnyFilter) {
      fetchBarChart('violent_crime');
      fetchBarChart('systemwide_crime');
      fetchLineChart('systemwide_crime');
      fetchAgencyWideBarChart('agency_wide');
      fetchAgencyWideLineChart('agency_wide');
    } else {
      if (totalSelectedDates1.length === 0 || Object.keys(ucrData).length === 0) {
        return;
      }
      fetchBarChart('violent_crime');
      fetchBarChart('systemwide_crime');
      fetchLineChart('systemwide_crime');
      if (vetted) {
        fetchAgencyWideBarChart('agency_wide');
        fetchAgencyWideLineChart('agency_wide');
      }
    }
  }, [filtersVetted, totalSelectedDates1, ucrData]);

  const handleUnvettedFilterChange = (name, selected) => {
    setFilters((prev) => ({ ...prev, [name]: selected }));
  };
  const handlevettedFilterChange = (name, selected) => {

    setFiltersVetted((prev) => ({ ...prev, [name]: selected }));
  };
  return (
    <>
      <div className="py-3 rounded mt-3">
        <div className="align-items-center d-flex items-center justify-between">
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="metro__main-title mt-0">Average Incident Response Time - Monthly Trend</h5>
          </Col>

          <div className="w-100 d-flex gap-3">
            <div className="w-100 d-flex gap-3">
              <span style={{ visibility: 'hidden' }}><CheckBoxDropdown name={'line_name'} options={vettedRoute} label={'Route'} onChange={handlevettedFilterChange} uniqueId="systemwide5" /></span>
              <div className="d-flex flex-column gap-2">
                <p className="mb-1 metro__dropdown-label">Date</p>
                <div className="md:basis-3/12">
                  <div className="relative">
                    <div
                      className="absolute bg-white"
                      style={{
                        width: '237px',
                        height: '32px',
                        borderRadius: '4px',
                        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 4px 0px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 10px'
                      }}
                      onClick={handleDateDropdownClick}
                      ref={dateDropdownRef}
                    >
                      <div className="flex gap-3 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                          <path d="M15.6 9.69727C15.975 9.96419 16.3094 10.2669 16.6031 10.6055C16.8969 10.944 17.15 11.3151 17.3625 11.7188C17.575 12.1224 17.7313 12.5488 17.8313 12.998C17.9313 13.4473 17.9875 13.9062 18 14.375C18 15.1497 17.8594 15.8789 17.5781 16.5625C17.2969 17.2461 16.9094 17.8418 16.4156 18.3496C15.9219 18.8574 15.35 19.2578 14.7 19.5508C14.05 19.8438 13.35 19.9935 12.6 20C12.0312 20 11.4813 19.9121 10.95 19.7363C10.4188 19.5605 9.93125 19.3066 9.4875 18.9746C9.04375 18.6426 8.65 18.2454 8.30625 17.7832C7.9625 17.321 7.69688 16.8099 7.50938 16.25H0V1.25H2.4V0H3.6V1.25H12V0H13.2V1.25H15.6V9.69727ZM1.2 2.5V5H14.4V2.5H13.2V3.75H12V2.5H3.6V3.75H2.4V2.5H1.2ZM7.22813 15C7.20938 14.7982 7.2 14.5898 7.2 14.375C7.2 13.8151 7.275 13.2715 7.425 12.7441C7.575 12.2168 7.80313 11.7188 8.10938 11.25H7.2V10H8.4V10.8398C8.65625 10.5078 8.94063 10.2148 9.25313 9.96094C9.56563 9.70703 9.90313 9.48893 10.2656 9.30664C10.6281 9.12435 11.0063 8.98763 11.4 8.89648C11.7938 8.80534 12.1938 8.75651 12.6 8.75C13.225 8.75 13.825 8.85742 14.4 9.07227V6.25H1.2V15H7.22813ZM12.6 18.75C13.1813 18.75 13.725 18.6361 14.2313 18.4082C14.7375 18.1803 15.1813 17.8678 15.5625 17.4707C15.9438 17.0736 16.2438 16.6113 16.4625 16.084C16.6813 15.5566 16.7938 14.987 16.8 14.375C16.8 13.7695 16.6906 13.2031 16.4719 12.6758C16.2531 12.1484 15.9531 11.6862 15.5719 11.2891C15.1906 10.8919 14.7469 10.5794 14.2406 10.3516C13.7344 10.1237 13.1875 10.0065 12.6 10C12.0188 10 11.475 10.1139 10.9688 10.3418C10.4625 10.5697 10.0188 10.8822 9.6375 11.2793C9.25625 11.6764 8.95625 12.1387 8.7375 12.666C8.51875 13.1934 8.40625 13.763 8.4 14.375C8.4 14.9805 8.50938 15.5469 8.72813 16.0742C8.94688 16.6016 9.24688 17.0638 9.62813 17.4609C10.0094 17.8581 10.4531 18.1706 10.9594 18.3984C11.4656 18.6263 12.0125 18.7435 12.6 18.75ZM13.2 13.75H15V15H12V11.25H13.2V13.75ZM2.4 10H3.6V11.25H2.4V10ZM4.8 10H6V11.25H4.8V10ZM4.8 7.5H6V8.75H4.8V7.5ZM2.4 12.5H3.6V13.75H2.4V12.5ZM4.8 12.5H6V13.75H4.8V12.5ZM8.4 8.75H7.2V7.5H8.4V8.75ZM10.8 8.75H9.6V7.5H10.8V8.75ZM13.2 8.75H12V7.5H13.2V8.75Z" fill="#2A54A7" />
                        </svg>
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
                            } flex-col bg-white rounded-lg px-2.5 pb-4 max-h-80 overflow-y-scroll mt-2 border-2 metro__custom-dp`}
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
                                      vetted ? (date.selectedMonths && date.selectedMonths.length === date.months.length) :
                                        (date.selectedWeeks && date.selectedWeeks.length === date.weeks.length)
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

                                      let weeksinThisMonth = [];

                                      if (!vetted && date.weeks && date.weeks[monthIndex].length) {
                                        weeksinThisMonth = date.weeks[monthIndex].map((week) => `${date.year}-${monthNumber}-1-${week}`);
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
                                                  (date.selectedWeeks && equal(date.selectedWeeks, weeksinThisMonth))
                                              }
                                              onChange={(e) => handleMonthCheckboxClick(e, key, weeksinThisMonth)}
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
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="Bar-Graph w-100 p-4 mt-4 bg-white metro__section-card">
          <IncidentLineChart data={jsonData} />
        </div>
      </div>

      {typeof lineAgencyChartData.agency_wide !== 'undefined' && vetted && lineAgencyChartData.agency_wide?.length !== 0 && (
        <>
          <div className="align-items-center d-flex items-center justify-between mt-3">
            <Col md={6} className="mb-3 mb-md-0">
              <h5 className="mb-3 metro__main-title mt-3">Average Response Time by Category</h5>
            </Col>
          </div>
          <div className='row'>
            <div className='Bar-Graph  col-md-6'>
              <div className="w-100 mt-4 bg-white metro__section-card">
                {/* {barData.agency_wide && <ReactApexchartBar2 chartData1={barData.agency_wide} height={373} />} */}
                <AvgByCategoryChart data={jsonData} />
              </div>
            </div>
            <div className='col-md-6'>
              <div className="Bar-Graph w-100 mt-4 bg-white metro__section-card">
                {/* {lineAgencyChartData.agency_wide && <ReactApexchartLine chartData1={lineAgencyChartData.agency_wide} height={405} />} */}
                <AvgByAgencyMonthlyChart data={jsonData} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
IncidentResponseTime.propTypes = {
  chartData: PropTypes.array.isRequired,
  legendLabel: PropTypes.string
};
export default IncidentResponseTime;
