'use client';
import React from 'react';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ApexLineChart({ chartData, legendLabel }) {
  const series = [
    {
      name: 'Series 1',
      data: [
        { x: new Date('2021-01-01').getTime(), y: 30 },
        { x: new Date('2021-02-01').getTime(), y: 40 },
        { x: new Date('2021-03-01').getTime(), y: 35 }
        // Add more data points here
      ]
    }
  ];

  const options = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true
      }
    },
    xaxis: {
      type: 'datetime'
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 0
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy'
      }
    },
    title: {
      text: 'Zoomable Time Series Line Chart',
      align: 'left'
    },
    yaxis: {
      title: {
        text: 'Values'
      }
    }
  };

  return <ApexChart options={options} series={series} type="line" height={350} />;
}
