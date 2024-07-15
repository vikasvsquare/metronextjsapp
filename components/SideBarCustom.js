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

  return (
    <>
      <div className="bg-white sidebar">
        <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>

          <Accordion.Item eventKey="0">
            <Accordion.Header>Call for Service</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li className={`px-4 py-2 ${statType === 'calls-for-service' && pathName === `/${statType}/rail` ? 'active' : ''}`}>
                  <Link
                    href={`/calls-for-service/rail`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
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
                  >
                    System Wide
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Crime</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li className={`px-4 py-2 ${statType === '' && pathName === '/' ? 'active' : ''}`}>
                  <Link
                    href={`/`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
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
                  >
                    Bus
                  </Link>
                </li>
                <li className={`px-4 py-2 ${statType === 'crime' && pathName === `/${statType}/system-wide` ? 'active' : ''}`}>
                  <Link
                    href={`/crime/system-wide`}
                    className={(pathName === `/${statType}/system-wide`
                      ? 'active'
                      : '')
                    }
                  >
                    System Wide
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          <Accordion.Item eventKey="2">
            <Accordion.Header>Arrest</Accordion.Header>
            <Accordion.Body>
              <ul>
                <li className={`px-4 py-2 ${statType === 'arrests' && pathName === `/${statType}/rail` ? 'active' : ''}`}>
                  <Link
                    href={`/arrests/rail`}
                    className={(pathName === `/${statType}/rail`
                      ? 'active'
                      : '')
                    }
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
                  >
                    System Wide
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}

export default SideBarCustom;
