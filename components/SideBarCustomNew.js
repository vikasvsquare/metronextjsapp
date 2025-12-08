
'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Accordion, Button } from 'react-bootstrap';
import Image from 'next/image';
import GlobeIcon from '@/assets/icons/GlobeIcon';
import CalendarIcon from '@/assets/icons/CalendarIcon';
import TruckIcon from '@/assets/icons/TruckIcon';
import ColumnIcon from '@/assets/icons/ColumnIcon';
import DocumentIcon from '@/assets/icons/DocumentIcon';

function SideBarCustomNew() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [statType, transportType] = pathName.substring(1).split('/');

  const GeoMap = searchParams.get('type');

  return (
    <>
      <div className={`p-2`}>
        <div className="container-fluid">
          <Image
            alt="metro-logo"
            src="/assets/metro-logo.svg"
            width={193}
            height={52}
            priority
          />
          <Accordion defaultActiveKey={['0', '1', '2', '3', '4']} alwaysOpen flush className="mt-4">
            {/* Incident Response Time */}
            <Accordion.Item eventKey="4">
              <Accordion.Header className="metro__sidebar-main-title">Incident Response Time</Accordion.Header>
              <Accordion.Body className="d-flex flex-column align-items-start">
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === 'incident-response-time' && pathName === '/incident-response-time' ? 'metro__active rounded-3' : ''}`}>
                  <GlobeIcon size={20} className="metro__sidebar_active" color={(statType === 'incident-response-time' && pathName === '/incident-response-time'
                    ? 'white'
                    : ' black')} />

                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/incident-response-time/`}
                      className={(pathName === `/incident-response-time` && statType === `incident-response-time`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Systemwide
                    </Link>
                  </p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Crime */}
            <Accordion.Item eventKey="0">
              <Accordion.Header className="metro__sidebar-main-title">Crime</Accordion.Header>
              <Accordion.Body className="d-flex flex-column align-items-start">
                <div className={`align-items-center d-flex form-check gap-10px w-100 p-2 rounded-3 w-100 ${statType === 'crime' && pathName === `/${statType}/rail` ? 'metro__active' : ''}`}>
                  <CalendarIcon size={20} color={(statType === 'crime' && pathName === `/${statType}/rail`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/crime/rail`}
                      className={(pathName === `/${statType}/rail` && statType === `crime`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Rail
                    </Link>
                  </p>
                </div>
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === 'crime' && pathName === `/${statType}/bus` ? 'metro__active rounded-3' : ''}`}>
                  <TruckIcon size={20} className="metro__sidebar_active" color={(statType === 'crime' && pathName === `/${statType}/bus`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/crime/bus`}
                      className={(pathName === `/${statType}/bus` && statType === `crime`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Bus
                    </Link>
                  </p>
                </div>
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === '' && pathName === '/' ? 'metro__active rounded-3' : ''}`}>
                  <GlobeIcon size={20} className="metro__sidebar_active" color={(statType === '' && pathName === '/'
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/`}
                      className={(pathName === `/${statType}/system-wide` && statType === `crime`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Systemwide
                    </Link>
                  </p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Arrests */}
            <Accordion.Item eventKey="1">
              <Accordion.Header className="metro__sidebar-main-title">Arrests</Accordion.Header>
              <Accordion.Body className="d-flex flex-column align-items-start">
                <div className={`align-items-center d-flex form-check gap-10px w-100 p-2 ${statType === 'arrests' && pathName === `/${statType}/rail` ? 'metro__active rounded-3' : ''}`}>
                  <CalendarIcon size={20} color={(statType === 'arrests' && pathName === `/${statType}/rail`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/arrests/rail`}
                      className={(pathName === `/${statType}/rail` && statType === `arrests`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Rail
                    </Link>
                  </p>
                </div>
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === 'arrests' && pathName === `/${statType}/bus` ? 'metro__active rounded-3' : ''}`}>
                  <TruckIcon size={20} className="metro__sidebar_active" color={(statType === 'arrests' && pathName === `/${statType}/bus`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/arrests/bus`}
                      className={(pathName === `/${statType}/bus` && statType === `arrests`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Bus
                    </Link>
                  </p>
                </div>
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === 'arrests' && pathName === `/${statType}/system-wide` ? 'metro__active rounded-3' : ''}`}>
                  <GlobeIcon size={20} className="metro__sidebar_active" color={(statType === 'arrests' && pathName === `/${statType}/system-wide`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/arrests/system-wide`}
                      className={(pathName === `/${statType}/system-wide` && statType === `arrests`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Systemwide
                    </Link>
                  </p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Calls for Service */}
            <Accordion.Item eventKey="2">
              <Accordion.Header className="metro__sidebar-main-title">Calls For Service</Accordion.Header>
              <Accordion.Body className="d-flex flex-column align-items-start">
                <div className={`align-items-center d-flex form-check gap-10px w-100 p-2 ${statType === 'calls-for-service' && pathName === `/${statType}/rail` ? 'metro__active rounded-3' : ''}`}>
                  <CalendarIcon size={20} color={(statType === 'calls-for-service' && pathName === `/${statType}/rail`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/calls-for-service/rail`}
                      className={(pathName === `/${statType}/rail` && statType === `calls-for-service`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Rail
                    </Link>
                  </p>
                </div>
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === 'calls-for-service' && pathName === `/${statType}/bus` ? 'metro__active rounded-3' : ''}`}>
                  <TruckIcon size={20} className="metro__sidebar_active" color={(statType === 'calls-for-service' && pathName === `/${statType}/bus`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/calls-for-service/bus`}
                      className={(pathName === `/${statType}/bus` && statType === `calls-for-service`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Bus
                    </Link>
                  </p>
                </div>
                <div className={`d-flex gap-10px align-items-center p-2 w-100 ${statType === 'calls-for-service' && pathName === `/${statType}/system-wide` ? 'metro__active rounded-3' : ''}`}>
                  <GlobeIcon size={20} className="metro__sidebar_active" color={(pathName === `/${statType}/system-wide` && statType === `calls-for-service`
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/calls-for-service/system-wide`}
                      className={(pathName === `/${statType}/system-wide` && statType === `calls-for-service`
                        ? 'active metro__txt-active-white'
                        : ' metro__txt-active-black')
                      }
                      prefetch={true}
                    >
                      Systemwide
                    </Link>
                  </p>
                </div>
              </Accordion.Body>
            </Accordion.Item>

            {/* Additional Info */}
            <Accordion.Item eventKey="3">
              <Accordion.Header className="metro__sidebar-main-title">Additional Info</Accordion.Header>
              <Accordion.Body className={`d-flex flex-column align-items-start `}>
                <div className={`align-items-center d-flex form-check gap-10px w-100 p-2 rounded-3 w-100 ${statType === 'glossary' ? 'metro__active rounded-3' : ''}`}>
                  <ColumnIcon size={20} color={(statType === 'glossary'
                    ? 'white'
                    : ' black')} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/glossary`}
                      className={(pathName === `glossary` ? 'active metro__txt-active-white' : 'metro__txt-active-black')}
                      prefetch={true}
                    >
                      Glossary
                    </Link>
                  </p>
                </div>
                <div className="d-flex gap-10px align-items-center p-2 w-100">
                  <DocumentIcon size={25} className="metro__sidebar_active" color={'black'} />
                  <p className="mb-md-0 metro__sidebar-main-subtitle">
                    <Link
                      href={`/assets/pdf/Public Safety Analytics Policy (GEN 63).pdf`}
                      className="metro__txt-active-black"
                      prefetch={true}
                      target='_blank'
                    >
                      Public Safety Analytics Policy
                    </Link>
                  </p>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </>
  );
}

export default SideBarCustomNew;
