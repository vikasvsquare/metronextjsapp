"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function IncidentLineChart({ data }) {
    const averageData = useMemo(() => {
        const grouped = {};

        data.forEach((item) => {
            const key = item.year_month;

            if (!grouped[key]) {
                grouped[key] = {
                    times: [],
                    dateObj: new Date(item.year_month)
                };
            }

            grouped[key].times.push(parseFloat(item.incident_response_time));
        });

        return Object.values(grouped)
            .map((row) => {
                const avg =
                    row.times.reduce((sum, v) => sum + v, 0) / row.times.length;

                return {
                    label: row.dateObj.toLocaleString("en-US", {
                        month: "short",
                        year: "2-digit"
                    }),
                    sortKey: row.dateObj.getTime(),
                    value: Number(avg.toFixed(2))
                };
            })
            .sort((a, b) => a.sortKey - b.sortKey);
    }, [data]);

    const categories = averageData.map((item) => item.label);
    const values = averageData.map((item) => item.value);

    const options = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false }
        },
        stroke: {
            curve: "smooth",
            width: 3
        },
        markers: {
            size: 5
        },
        xaxis: {
            categories,
            labels: {
                rotate: -45
            },
            title: {
                text: "Month - Year"
            }
        },
        yaxis: {
            title: {
                text: "Average Minutes"
            }
        },
        colors: ["#00308F"] // Same blue color
    };

    const series = [
        {
            name: "Average Response Time",
            data: values
        }
    ];

    return (
        <div className="w-full">
            <Chart options={options} series={series} type="line" height={350} />
        </div>
    );
}
