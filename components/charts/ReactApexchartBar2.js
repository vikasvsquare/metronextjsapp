import React, { useState } from 'react';
import Chart from 'react-apexcharts';

const ReactApexchartBar2 = ({ chartData1, height }) => {
  const crimeData = chartData1;

  const labels = Object.keys(crimeData);
  const values = Object.values(crimeData);

  const options = {
    chart: {
      type: 'bar',
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '70%',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
    xaxis: {
      categories: labels,
    },
    fill: {
      colors: ['#001f77', '#dae5f1', '#9dc3e6', '#4a86e8', '#add8e6',
        '#2A54A7', '#2c2c3c', '#6cb5f3', '#0f52ba', '#1e90ff',
        '#0000ff', '#c0d6c1', '#2b2b2b', '#2a52be', '#b9aedc',
        '#b08080', '#001f77', '#dae5f1', '#9dc3e6', '#4a86e8', '#add8e6', '#2c2c3c', '#6cb5f3',
        '#0f52ba', '#1e90ff', '#0000ff', '#c0d6c1', '#2b2b2b', '#2a52be', '#b9aedc',],
    },
    grid: {
      row: {
        colors: ['#f2f5fa'],
      },
    },
    tooltip: {
      enabled: true,
    },
  };

  const series = [
    {
      name: 'Crime Count',
      data: values,
    },
  ];

  return (
    <div>
      {chartData1 ? (
        <div className="p-3 bg-white rounded">
          <Chart options={options} series={series} type="bar" height={height ? height : 600} />
        </div>
      ) : ""}
    </div>
  );
};

export default ReactApexchartBar2;
