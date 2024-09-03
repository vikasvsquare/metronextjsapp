'use client';
import React from 'react';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
const colors = ['#FEBC4A', '#40A0FC', '#50E7A6', '#EA606B', ' #775DD0', '#FE4560', '#FF5733', '#33FF57', '#3357FF', '#5C4033', '#8B0000', '#988558', '#C2B280', '#36454F', '#1B1212', '#3BB371', '#B0E0E6', '#2E4F4F', '#00E396', '#FEEFD5', '#EEE8AA'];
export default function ApexLineChart({ chartData }) {

  // const updateChartData = chartData.map(obj => {
  //   const filteredObj = Object.fromEntries(
  //     Object.entries(obj).filter(([key, value]) => value !== 0)
  //   );

  //   const sortedObj = Object.keys(filteredObj)
  //     .sort()
  //     .reduce((acc, key) => {
  //       acc[key] = filteredObj[key];
  //       return acc;
  //     }, {});

  //   return sortedObj;
  // });
  const keysToRemove = Object.keys(chartData[0]).filter(key => 
    key !== "name" && chartData.every(item => item[key] === 0)
);

// Step 2: Remove those keys from each object and sort the remaining keys
const updateChartData = chartData.map(item => {
    const newItem = { name: item.name }; // Keep the "name" key first
    Object.keys(item)
        .filter(key => key !== "name" && !keysToRemove.includes(key))
        .sort()
        .forEach(key => {
            newItem[key] = item[key];
        });
    return newItem;
});

  console.log(updateChartData);
  function categoryData(updateChartData) {
    const categoryData = [];
    for (const key in updateChartData[0]) {
      if (key !== 'name' && updateChartData[0].hasOwnProperty(key)) {
        categoryData.push(key);
      }
    }
    return categoryData;
  }

  const categories = updateChartData.map(entry => entry.name);
  const seriesNames = categoryData(updateChartData);
  const series = seriesNames.map(name => ({
    name: name,
    data: updateChartData.map(entry => entry[name])
  }));

  const chartOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: false,
        type: 'x', // Enable zooming on the x-axis
        autoScaleYaxis: true
      }
    },
    colors: colors,
    dataLabels: {
      enabled: true,
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
      // text: 'Crime Incidents Over Time',
      align: 'center'
    },
    stroke: {
      curve: 'smooth'
    },
    tooltip: {
      shared: false,
      intersect: false,
      x: {
        format: 'dd MMM yyyy',
      },
    }
  };


  return <div style={{ marginTop: '-1.5rem' }}><ApexChart options={chartOptions} series={series} type="line" height={400} /></div>;
}
