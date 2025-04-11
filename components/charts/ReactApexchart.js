import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const ReactApexchart = ({ chartData1, height }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      colors: [
        '#001f77', '#dae5f1', '#9dc3e6', '#4a86e8', '#add8e6',  '#2c2c3c', '#6cb5f3',
        '#0f52ba', '#1e90ff', '#0000ff', '#c0d6c1', '#2b2b2b', '#2a52be', '#b9aedc',
      ],
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
            customIcons: []
          }
        },
      },
      xaxis: {
        categories: ['Jan 2024'], // Adjust if you have real date data
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
    if (!chartData1 || typeof chartData1 !== 'object') return;

    const updatedSeries = Object.entries(chartData1).map(([name, value]) => ({
      name,
      data: [value],
    }));

    setChartData((prev) => ({
      ...prev,
      series: updatedSeries,
    }));
  }, [chartData1]);

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={height || 600}
      />
    </div>
  );
};

export default ReactApexchart;
