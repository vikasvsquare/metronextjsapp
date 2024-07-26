'use client';
import React from 'react';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PieApexchart({ chartData }) {
    const categories = Object.keys(chartData);
    const values = Object.values(chartData);

    // Calculate total
    const total = values.reduce((sum, value) => sum + value, 0);

    // Calculate percentages
    const percentages = values.map(value => ((value / total) * 100).toFixed(2));


    const options = {
        series: values,
        chart: {
            type: 'pie',
            height: 350
        },
        labels: categories,
        tooltip: {
            y: {
                formatter: (val, { seriesIndex }) => `${percentages[seriesIndex]}%`
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val, { seriesIndex }) => values[seriesIndex].toString()
          },
        legend: {
            position: 'bottom'
          }
    };

    return (
        <div className="relative">
            <ApexChart options={options} series={options.series} type="pie" height={450} />
        </div>
    )
}
