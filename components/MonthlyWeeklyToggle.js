'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
export default function MonthlyWeeklyToggle({ handleVettedToggle }) {
    const pathName = usePathname();
    const [isToggled, setIsToggled] = useState(true);
    const [isDisable, setIsDisable] = useState(false);
    const [statType] = pathName.substring(1).split('/');

    useEffect(() => {
        if (pathName) {
            if (statType === 'calls-for-service') {
                setIsDisable(true);
            } else if (statType === 'arrests') {
                setIsDisable(true);
            }
            else {
                setIsDisable(false);
            }
            setIsToggled(true);
        }
    }, [pathName])


    const handleToggle = () => {
        setIsToggled(!isToggled);
        handleVettedToggle(!isToggled);
    };
    return (
        <>
            <label className={`form-check-label font-extrabold not-italic ${isToggled ? 'text-[#9ca3af]' : 'text-black'}`} htmlFor="flexSwitchCheckDefault" style={{ fontSize: 20, marginRight: 16 }}>
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
                    disabled={isDisable}
                />
            </div>
            <label className={`form-check-label font-extrabold not-italic ${isToggled ? 'text-black' : 'text-[#9ca3af]'}`} htmlFor="flexSwitchCheckDefault" style={{ fontSize: 20 }}>
                Monthly
            </label>
        </>
    )
}
