'use client';
import { useEffect, useState } from 'react';

function DashboardCardsListBlue({ label, labelValue, current_month, total_boardings, millionCheck }) {
  const [calculatedValue, setCalculatedValue] = useState(null);

  useEffect(() => {

    // Example values (you can replace these with dynamic ones)
    const part = current_month;
    const total = total_boardings;

    // Step 1: percentage
    const percentage = (part / total) * 100;
    // Step 2: subtract from 100
    const finalValue = 100 - percentage;
    // Step 3: round to 3 decimals
    const rounded = Number(finalValue.toFixed(3));

    // Step 4: update state
    setCalculatedValue(rounded);

  }, [current_month, total_boardings]);

  return (
    <>
      <div className="metro-custom_card-wrapper text-white metro__custom-card">
        <div className="card-body">
          <p className="metro__crime-card-label">{label}</p>
          <p className="card-subtitle mb-2 fs-1">{!millionCheck && (parseInt(labelValue) == 0 ||  parseInt(labelValue) > 0) ? parseInt(labelValue)  :  millionCheck ? labelValue : calculatedValue +'%'}</p>
        </div>
      </div>
    </>
  );
}

export default DashboardCardsListBlue;
