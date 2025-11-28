"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AvgByAgencyMonthlyChart({ data }) {
  const agencies = ["LAPD", "LASD", "LBPD"];

  const { categories, series } = useMemo(() => {
    const grouped = {};

    data.forEach(item => {
      const agency = item.agency?.toUpperCase();
      if (!agencies.includes(agency)) return;

      const date = new Date(item.year_month);
      const label = date.toLocaleString("en-US", {
        month: "short",
        year: "2-digit"
      }); // Example: "Jan 25"

      if (!grouped[label]) {
        grouped[label] = { LAPD: [], LASD: [], LBPD: [] };
      }

      grouped[label][agency].push(
        parseFloat(item.incident_response_time)
      );
    });

    const sortedLabels = Object.keys(grouped)
      .sort((a, b) => new Date(a) - new Date(b));

    const series = agencies.map(agency => ({
      name: agency,
      data: sortedLabels.map(label => {
        const arr = grouped[label][agency];
        if (arr.length === 0) return 0;
        return Number(
          (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(2)
        );
      })
    }));

    return { categories: sortedLabels, series };
  }, [data]);

  const options = {
    chart: { stacked: true, toolbar: { show: false } },
    xaxis: {
      categories,
      labels: { rotate: -45 }
    },
    yaxis: { title: { text: "Minutes" } },
    colors: ["#002D72", "#5A7FA5", "#78B7DD"] // LAPD, LASD, LBPD
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={350}
    />
  );
}
