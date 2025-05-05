import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ReactApexchartLine = ({ chartData1, height, xAxis="", yAxis="" }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
        },
      },
      colors: [
        '#001f77', '#dae5f1', '#9dc3e6', '#4a86e8', '#2A54A7', '#6cb5f3', '#0f52ba', '#1e90ff',
        '#0000ff', '#c0d6c1', '#2b2b2b', '#2a52be', '#b9aedc',
        '#b08080', '#001f77', '#dae5f1', '#9dc3e6', '#4a86e8', '#add8e6', '#2c2c3c', '#6cb5f3',
        '#0f52ba', '#1e90ff', '#0000ff', '#c0d6c1', '#2b2b2b', '#2a52be', '#b9aedc',
      ],

      xaxis: {
        categories: [],
        title: {
          text: xAxis,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '1rem'
          },
        },
      },
      yaxis: {
        title: {
          text: yAxis ? yAxis : "",
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
          },
        },
      },
      legend: {
        position: 'bottom',
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      fill: {
        opacity: 1,
      },
    },
  });

  useEffect(() => {
    console.log("chartData1", chartData1)
    if (!Array.isArray(chartData1)) return;
    if (chartData1.length === 0) return;
    const categories = chartData1.map(item => item.name); // ['Nov 24', 'Dec 24', 'Jan 25']
    const crimeTypes = Object.keys(chartData1[0]).filter(key => key !== 'name');

    const series = crimeTypes.map(type => ({
      name: type,
      data: chartData1.map(item => item[type] ?? 0),
    }));

    setChartData(prev => ({
      ...prev,
      series,
      options: {
        ...prev.options,
        xaxis: {
          ...prev.options.xaxis,
          categories,
        },
      },
    }));
  }, [chartData1]);

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={height || 500}
      />
    </div>
  );
};

export default ReactApexchartLine;
