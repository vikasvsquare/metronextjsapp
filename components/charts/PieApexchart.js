'use client';
import React from 'react';

import dynamic from 'next/dynamic';
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function PieApexchart({ chartData }) {
    const colors = ['#FEBC4A', '#40A0FC', '#50E7A6', '#EA606B',' #775DD0', '#FE4560', '#FF5733', '#33FF57', '#3357FF', '#5C4033', '#8B0000', '#988558', '#C2B280', '#36454F', '#FEEFD5', '#1B1212', '#3BB371', '#EEE8AA', '#B0E0E6', '#2E4F4F', '#00E396'];
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
            height: 350,
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
                },
                export: {
                    csv: {
                        filename: 'chart-data',
                        columnDelimiter: ',',
                        headerCategory: 'Category',
                        headerValue: 'Value',
                    },
                    svg: {
                        filename: 'chart',
                    },
                    png: {
                        filename: 'chart',
                    },
                },
            },
        },
        colors: colors,
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
