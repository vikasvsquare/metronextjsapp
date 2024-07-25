'use client'
import React  from "react";

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
export default function BarCharts({ chartData, legendLabel }) {


  function returnSeriesData(chartData){
    const seriesData = [];
    for (const key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        seriesData.push(chartData[key]);
      }
    }
    return seriesData;
  }

  function categoryData(chartData){
    const categoryData = [];
    for (const key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        categoryData.push(key);
      }
    }
    return categoryData;
  }

  let barObj = {  
    series: [{
      name: 'Crime Count',
      data: returnSeriesData(chartData)
    }],
    options: {
      chart: {
        type: 'bar',
        height: 300,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          dataLabels: {
            position: 'center', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ["#000000"]
        },
        formatter: function(val) {
          return new Intl.NumberFormat().format(val);
        },
      },
      xaxis: {
        categories: categoryData(chartData),
        tooltip: {
          enabled: false,
        }
      },
    }
  }

  return (
    <>
      {barObj && barObj?.series[0]?.data && barObj?.series[0]?.data &&
        <ApexChart options={barObj.options} series={barObj.series} type="bar" height={350} />
      }
    </>

  );
}
