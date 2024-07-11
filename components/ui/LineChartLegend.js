import React from 'react';

function LineChartLegend() {
  return (
    <div>
      <ul className="flex justify-around items-center text-sm pt-4 text-center">
        <li>
          <span className="font-bold">LAPD:</span> Los Angeles Police Department
        </li>
        <li>
          <span className="font-bold">LASD: </span>Los Angeles County Sheriff's Department
        </li>
        <li>
          <span className="font-bold">LBPD: </span>Long Beach Police Department
        </li>
      </ul>
    </div>
  );
}

export default LineChartLegend;
