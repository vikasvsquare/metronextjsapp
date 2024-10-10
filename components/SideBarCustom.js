'use client';
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Accordion, Button } from 'react-bootstrap';

function SideBarCustom({ searchData, routeData, createQueryString }) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [statType, transportType] = pathName.substring(1).split('/');

  const GeoMap = searchParams.get('type');
  return (
    <>
      <div className={`bg-white sidebar ${GeoMap === 'geomap' ? 'hidden' : ''}`}>
        <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Crime</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li className={`px-4 py-2 ${statType === 'crime' && pathName === `/${statType}/rail` ? 'active' : ''}`}>
                  <Link
                    href={`/crime/rail`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Rail
                  </Link>
                </li>
                <li className={`px-4 py-2 ${statType === 'crime' && pathName === `/${statType}/bus` ? 'active' : ''}`}>
                  <Link
                    href={`/crime/bus`}
                    className={(pathName === `/${statType}/bus`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Bus
                  </Link>
                </li>
                {/* <li className={`px-4 py-2 ${statType === 'crime' && pathName === `/${statType}/system-wide` ? 'active' : ''}`}>
                  <Link
                    href={`/crime/system-wide`}
                    className={(pathName === `/${statType}/system-wide`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Systemwide
                  </Link>
                </li> */}
                <li className={`px-4 py-2 ${statType === '' && pathName === '/' ? 'active' : ''}`}>
                  <Link
                    href={`/`}
                    className={(pathName === `/${statType}/system-wide`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Systemwide
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Arrests</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li className={`px-4 py-2 ${statType === 'arrests' && pathName === `/${statType}/rail` ? 'active' : ''}`}>
                  <Link
                    href={`/arrests/rail`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Rail
                  </Link>
                </li>
                <li className={`px-4 py-2 ${statType === 'arrests' && pathName === `/${statType}/bus` ? 'active' : ''}`}>
                  <Link
                    href={`/arrests/bus`}
                    className={(pathName === `/${statType}/bus`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Bus
                  </Link>
                </li>
                <li className={`px-4 py-2 ${statType === 'arrests' && pathName === `/${statType}/system-wide` ? 'active' : ''}`}>
                  <Link
                    href={`/arrests/system-wide`}
                    className={(pathName === `/${statType}/system-wide`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Systemwide
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Calls for Service</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li className={`px-4 py-2 ${statType === 'calls-for-service' && pathName === `/${statType}/rail` ? 'active' : ''}`}>
                  <Link
                    href={`/calls-for-service/rail`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Rail
                  </Link>
                </li>
                <li className={`px-4 py-2 ${statType === 'calls-for-service' && pathName === `/${statType}/bus` ? 'active' : ''}`}>
                  <Link
                    href={`/calls-for-service/bus`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Bus
                  </Link>
                </li>
                <li className={`px-4 py-2 ${statType === 'calls-for-service' && pathName === `/${statType}/system-wide` ? 'active' : ''}`}>
                  <Link
                    href={`/calls-for-service/system-wide`}
                    className={(pathName === `/${statType}/system-wide`
                      ? 'active'
                      : '')
                    }
                    prefetch={true}
                  >
                    Systemwide
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Additional Info</Accordion.Header>
            <Accordion.Body>
            <ul>
            <li className={`px-4 py-2 ${statType === 'glossary' ? 'active' : ''}`}>
                  <Link
                    href={`/glossary`}
                    className="active"
                    prefetch={true}
                  >
                    Glossary
                  </Link>
                </li>
                <li className={`px-4 py-2 `}>
                <Link
                    href={`/assets/pdf/Public Safety Analytics Policy (GEN 63).pdf`}
                    className="active"
                    prefetch={true}
                    target='_blank'
                  >
                    Public Safety Analytics Policy 
                  </Link>
                </li>
                </ul>
              {/* <p><a href="/glossary" className='glossary'>Glossary</a></p> */}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

      </div>
    </>
  );
}

export default SideBarCustom;
