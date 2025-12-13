"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AvgByCategoryChart({ data }) {
  const agencies = ["LAPD", "LASD", "LBPD"];
  const categories = ["routine", "priority", "emergency"];

  const chartSeries = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    // Prepare structure: agency -> category -> response times[]
    const grouped = {
      LAPD: { routine: [], priority: [], emergency: [] },
      LASD: { routine: [], priority: [], emergency: [] },
      LBPD: { routine: [], priority: [], emergency: [] }
    };

    data.forEach(item => {
      const agency = item.agency?.toUpperCase();
      const category = item.incident_category?.toLowerCase();
      const value = Number(item.incident_response_time);

      if (!agencies.includes(agency)) return;
      if (!categories.includes(category)) return;
      if (isNaN(value)) return;

      grouped[agency][category].push(value);
    });

    // Convert → Apex series format
    const series = agencies.map(agency => ({
      name: agency,
      data: categories.map(cat => {
        const arr = grouped[agency][cat];
        if (!arr || arr.length === 0) return 0;

        const avg = arr.reduce((sum, n) => sum + n, 0) / arr.length;
        return Number(avg.toFixed(2));
      })
    }));

    return series;
  }, [data]);

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%"
      }
    },
    xaxis: {
      categories: ["Routine", "Priority", "Emergency"],
      labels: {
        style: {
          fontSize: "13px"
        }
      }
    },
    yaxis: {
      title: { text: "Average Minutes" }
    },
    colors: ['#001f77', "#6cb5f3", '#0000ff'], // LAPD, LASD, LBPD
    legend: {
      position: "bottom"
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val.toFixed(1),
      style: { fontSize: "12px" }
    }
  };

  return (
    <Chart
      options={options}
      series={chartSeries}
      type="bar"
      height={350}
    />
  );
}
