import React, { useEffect, useState } from "react";
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts'

// const data = {
//   series: [{
//     data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
//   }],
//   options: {
//     chart: {
//       type: 'bar',
//       height: 350
//     },
//     plotOptions: {
//       bar: {
//         borderRadius: 4,
//         horizontal: true,
//       }
//     },
//     dataLabels: {
//       enabled: false
//     },
//     xaxis: {
//       categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
//         'United States', 'China', 'Germany'
//       ],
//     }
//   },
// };

export default function BarCharts({ chartData }) {

  function returnSeriesData(chartData){
    const seriesData = [];

    // Extract keys and values
    for (const key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        seriesData.push(chartData[key]);
      }
    }
    return seriesData;
  }
  function categoryData(chartData){
    const categoryData = [];

    // Extract keys and values
    for (const key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        categoryData.push(key);
      }
    }
    return categoryData;
  }
  // const [barObj, setBarObj] = useState(null);
  let barObj = {
    series: [{
      data: returnSeriesData(chartData)
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categoryData(chartData)
      }
    },
  };
  
  

  return (
    <>
      {barObj && barObj?.series[0]?.data && barObj?.series[0]?.data &&
        <Chart options={barObj.options} series={barObj.series} type="bar" height={350} />
      }
    </>

  );
}
