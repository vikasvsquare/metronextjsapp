'use client';
import React, { useEffect, useState, useCallback } from 'react';

export default function MonthlyWeeklyToggle({ handleVettedToggle }) {
    const [isToggled, setIsToggled] = useState(true);
    // console.log(vetted)

    const handleToggle = () => {
        console.log()
        setIsToggled(!isToggled);
        handleVettedToggle(!isToggled);
    };
    return (
        <>
            <label className={`form-check-label font-extrabold not-italic ${isToggled ? 'text-[#9ca3af]' : 'text-black'}`} htmlFor="flexSwitchCheckDefault" style={{fontSize: 20, marginRight: 16}}>
                Weekly
            </label>
            <div className="form-check form-switch" style={{ fontSize: 22 }}>
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    checked={isToggled}
                    onChange={handleToggle}
                />
            </div>
            <label className={`form-check-label font-extrabold not-italic ${isToggled ? 'text-black' : 'text-[#9ca3af]'}`} htmlFor="flexSwitchCheckDefault" style={{fontSize: 20}}>
                Monthly
            </label>
        </>
    )
}
