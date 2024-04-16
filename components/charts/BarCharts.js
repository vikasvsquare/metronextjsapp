// import React, { useEffect, useState } from "react";
// // import ApexCharts from 'apexcharts'
// import Chart from 'react-apexcharts';

// // const data = {
// //   series: [{
// //     data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
// //   }],
// //   options: {
// //     chart: {
// //       type: 'bar',
// //       height: 350
// //     },
// //     plotOptions: {
// //       bar: {
// //         borderRadius: 4,
// //         horizontal: true,
// //       }
// //     },
// //     dataLabels: {
// //       enabled: false
// //     },
// //     xaxis: {
// //       categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan',
// //         'United States', 'China', 'Germany'
// //       ],
// //     }
// //   },
// // };

// export default function BarCharts({ chartData }) {

//   function returnSeriesData(chartData){
//     const seriesData = [];
//     for (const key in chartData) {
//       if (chartData.hasOwnProperty(key)) {
//         seriesData.push(chartData[key]);
//       }
//     }
//     return seriesData;
//   }

//   function categoryData(chartData){
//     const categoryData = [];
//     for (const key in chartData) {
//       if (chartData.hasOwnProperty(key)) {
//         categoryData.push(key);
//       }
//     }
//     return categoryData;
//   }
//   // const [barObj, setBarObj] = useState(null);
//   let barObj = {  
//     series: [{
//       name: 'Crime Count',
//       data: returnSeriesData(chartData)
//     }],
//     options: {
//       chart: {
//         type: 'bar',
//         height: 300,
//       },
//       plotOptions: {
//         bar: {
//           borderRadius: 4,
//           horizontal: true,
//           dataLabels: {
//             position: 'center', // top, center, bottom
//           },
//         }
//       },
//       dataLabels: {
//         enabled: true,
//         // offsetY: 0,
//         // offsetX: 0,
//         style: {
//           fontSize: '12px',
//           colors: ["#000000"]
//         }
//       },
      
//       xaxis: {
//         categories: categoryData(chartData),
//         // position: 'bottom',
//         // axisBorder: {
//         //   show: false
//         // },
//         // axisTicks: {
//         //   show: false
//         // },
//         tooltip: {
//           enabled: false,
//         }
//       },
      
//       // yaxis: {
//       //   axisBorder: {
//       //     show: false
//       //   },
//       //   axisTicks: {
//       //     show: false,
//       //   },
//       // }
//     },
//   }

//   return (
//     <>
//       {barObj && barObj?.series[0]?.data && barObj?.series[0]?.data &&
//         <Chart options={barObj.options} series={barObj.series} type="bar" height={350} />
//       }
//     </>

//   );
// }

'use client'
import React  from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BarCharts({ chartData, legendLabel }) {
  function returnSeriesData(chartData){
    const seriesData = [];
    for (const key in chartData) {
      if (chartData.hasOwnProperty(key)) {
        seriesData.push(chartData[key].toLocaleString('en-US'));
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
  // const [barObj, setBarObj] = useState(null);
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
        // offsetY: 0,
        // offsetX: 0,
        style: {
          fontSize: '12px',
          colors: ["#000000"]
        }
      },
      legend: {
        show: legendLabel ? true : false,
        showForSingleSeries: true,
        customLegendItems: ["Los Angeles Police Department", "Los Angeles County Sheriff's Department", "Long Beach Police Department"],
        markers: {
          fillColors: ["#73C7FF", "#73C7FF", "#73C7FF"],
        },
      },
      xaxis: {
        categories: categoryData(chartData),
        // position: 'bottom',
        // axisBorder: {
        //   show: false
        // },
        // axisTicks: {
        //   show: false
        // },
        tooltip: {
          enabled: false,
        }
      },
      
      // yaxis: {
      //   axisBorder: {
      //     show: false
      //   },
      //   axisTicks: {
      //     show: false,
      //   },
      // }
    }
  }

  return (
    <>
      {barObj && barObj?.series[0]?.data && barObj?.series[0]?.data &&
        // <Chart options={barObj.options} series={barObj.series} type="bar" height={350} />
        <ApexChart options={barObj.options} series={barObj.series} type="bar" height={350} />
      }
    </>

  );
}
