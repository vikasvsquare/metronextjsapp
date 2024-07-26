'use client';
import React from 'react';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ApexLineChart({ chartData }) {
  function categoryData(chartData) {
    const categoryData = [];
    for (const key in chartData[0]) {
      if (key !== 'name' && chartData[0].hasOwnProperty(key)) {
        categoryData.push(key);
      }
    }
    return categoryData;
  }

  const categories = chartData.map(entry => entry.name);
    const seriesNames = categoryData(chartData);
    const series = seriesNames.map(name => ({
        name: name,
        data: chartData.map(entry => entry[name])
    }));

    console.log(categories);
  const chartOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
        type: 'x', // Enable zooming on the x-axis
        autoScaleYaxis: true
      }
    },
    xaxis: {
      // type: 'datetime',
      categories: categories
    },
    yaxis: {
      title: {
        text: 'Incidents'
      }
    },
    title: {
      text: 'Crime Incidents Over Time',
      align: 'center'
    },
    stroke: {
      curve: 'smooth'
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: 'dd MMM yyyy',
      },
    }
  };


  return <div style={{marginTop: '-1.5rem'}}><ApexChart options={chartOptions} series={series} type="line" height={400} /></div>;
}
