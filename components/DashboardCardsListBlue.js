'use client';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NumberAbbreviate from 'number-abbreviate';
import Image from 'next/image';
import MonthlyWeeklyToggle from './MonthlyWeeklyToggle';
import dayjs from 'dayjs';

function DashboardCardsListBlue({label, labelValue}) {

  return (
    <>
       <div className="metro__w-214 text-white p-2 metro__custom-card">
            <div className="card-body">
              <p className="metro__crime-card-label">{label}</p>
              <p className="card-subtitle mb-2 fs-1">{labelValue}</p>
            </div>
          </div>
    </>
  );
}

export default DashboardCardsListBlue;
