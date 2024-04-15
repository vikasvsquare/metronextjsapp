import Image from 'next/image';
import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

function GeoMapTabs({ mapType, routeData, createQueryString }) {
  const router = useRouter();
  const pathName = usePathname();
  // const searchParams = useSearchParams();
  console.log(mapType);
  return (
    <div className="flex flex-col mb-5">
      <div className="geo-chart-wrapper">
        <div
          className={`geo-map-wrapper ${(!mapType || mapType === 'chart') ? ' geo-map-wrapper-active' : ''}`}
          onClick={() => {
            router.push(pathName + '?' + createQueryString('type', 'chart'));
          }}
        >
          <Image
            alt="Crime Systemwide"
            src={`${(!mapType || mapType === 'chart') ? '/assets/chart-1.svg' : '/assets/chart-1-black.svg'}`}
            width={25}
            height={25}
            priority
            style={{ color: 'black' }}
          />
        </div>
        <div
          className={`geo-map-wrapper ${mapType === 'geomap' ? ' geo-map-wrapper-active' : ''}`}
          onClick={() => {
            router.push(pathName + '?' + createQueryString('type', 'geomap'));
          }}
        >
          <Image
            alt="Crime Systemwide"
            src={`${mapType === 'geomap' ? '/assets/map-1-white.svg' : '/assets/map-1-black.svg'}`}
            width={25}
            height={25}
            priority
            style={{ color: 'black' }}
          />
        </div>
      </div>
    </div>
  );
}

export default GeoMapTabs;
