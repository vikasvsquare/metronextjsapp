'use client';
import React from 'react';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ApexLineChart({ chartData, legendLabel }) {
  const data = [
    {
      // name: "2023-01-Wk1",
      date:'2023-01-01',
      "Sex Offenses": 1,
      "Rape": 0,
      "Robbery": 3,
      "Agg Assault on Op": 0,
      "Battery": 20,
      "Homicide": 0,
      "Agg Assault": 7,
      "Battery on Operator": 1
    },
    {
      date: "2023-02-01",
      "Homicide": 1,
      "Agg Assault on Op": 0,
      "Rape": 0,
      "Robbery": 7,
      "Battery on Operator": 0,
      "Battery": 13,
      "Agg Assault": 5,
      "Sex Offenses": 1
    },
    {
      date: "2023-03-01",
      "Battery on Operator": 0,
      "Sex Offenses": 1,
      "Homicide": 0,
      "Battery": 8,
      "Agg Assault": 6,
      "Agg Assault on Op": 0,
      "Robbery": 4,
      "Rape": 0
    },
    {
      date: "2023-04-01",
      "Sex Offenses": 0,
      "Agg Assault": 5,
      "Agg Assault on Op": 0,
      "Battery": 16,
      "Rape": 0,
      "Battery on Operator": 0,
      "Robbery": 4,
      "Homicide": 1
    }
  ];

  // Convert the data into a format suitable for ApexCharts
  const formattedData = {
    categories: data.map(item => item.date),
    series: [
      { name: 'Sex Offenses', data: data.map(item => item['Sex Offenses']) },
      { name: 'Rape', data: data.map(item => item.Rape) },
      { name: 'Robbery', data: data.map(item => item.Robbery) },
      { name: 'Agg Assault on Op', data: data.map(item => item['Agg Assault on Op']) },
      { name: 'Battery', data: data.map(item => item.Battery) },
      { name: 'Homicide', data: data.map(item => item.Homicide) },
      { name: 'Agg Assault', data: data.map(item => item['Agg Assault']) },
      { name: 'Battery on Operator', data: data.map(item => item['Battery on Operator']) }
    ]
  };

  // Define the chart options
  const chartOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x', // Enable zooming on the x-axis
        autoScaleYaxis: true
      }
    },
    xaxis: {
      type: 'datetime',
      categories: formattedData.categories
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


  return <ApexChart options={chartOptions} series={formattedData.series} type="line" height={350} />;
}
