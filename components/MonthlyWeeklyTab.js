'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';

function MonthlyWeeklyTab() {
    const [data, setData] = useState(null);
    const [vetted, setVetted] = useState(true);
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [statType, transportType] = pathName.substring(1).split('/');
    const vettedType = searchParams.get('vetted');

    useEffect(() => {
        if (vettedType === "false") {
            setVetted(false);
        } else {
            setVetted(true);
        }
    }, [vettedType])

    useEffect(() => {
        async function fetchData(transportType) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_HOST}dashboard_details?transport_type=${transportType}&published=true`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data!');
                }

                const data = await response.json();
                setData(data);
            } catch (error) {
                console.log(error);
            }
        }

        if (pathName !== '/') {
            let [statType, transportType] = pathName.substring(1).split('/');
            if (transportType === 'system-wide') {
                transportType = 'systemwide';
            }
            if (statType === "arrests") {
                fetchData(transportType);
            } else if (statType === "calls-for-service") {
                fetchData(transportType);
            }
            else {
                fetchData(transportType);
            }
        } else {
            fetchData('rail');
        }

    }, [pathName]);

    function formatNumber(num) {
        return num?.toLocaleString('en-US');
    }

    function handleVettedToggle(value) {
        if (value) {
            setVetted(true);

            const query = new URLSearchParams({
                "line": "all",
                "type": "chart",
                "vetted": value
            }).toString();

            router.push(`${pathName}/?${query}`);

        } else {
            setVetted(false);
            router.push(pathName + '?' + createQueryString('type', 'chart'));
            router.push(pathName + '?' + createQueryString('vetted', value));
        }
    }

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    return (
        <div className="align-items-center d-flex gap-2 justify-content-center month-week-data">
            <button className={`${vetted ? 'active' : ''}`} onClick={() => handleVettedToggle(true)}>Monthly Data </button> |
            <button className={`${vetted ? '' : 'active'}`} onClick={() => handleVettedToggle(false)}>Weekly Data </button>
        </div>
    );
}

export default MonthlyWeeklyTab;
