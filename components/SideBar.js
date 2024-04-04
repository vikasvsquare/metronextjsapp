import React, { Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

function SideBar({ searchData, routeData, createQueryString }) {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <>
      <aside className="main-sidebar-sticky relative hidden lg:block lg:basis-3/12 pl-6 pt-6 bg-gradient-to-b from-[#050708] from-[-2.29%] to-[#0089E3] to-[90.57%] min-h-screen rounded-tr-3xl">
        <div>
          {/* <div className="relative w-11/12 mr-4 before:inline-block before:w-3.5 before:h-3.5 before:bg-[url('/assets/icon-search.svg')] before:bg-contain before:absolute before:top-1/2 before:-translate-y-1/2 before:left-5">
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Search Route"
              className="w-full bg-transparent text-white border border-solid border-white rounded pl-12 py-2 px-4 placeholder:text-center"
            />
          </div> */}
          <Suspense fallback={<Loader />}>
            <ul className="my-4">
              <li>
                <button
                  className={
                    'text-left font-bold rounded-l-2xl py-3 px-4 lg:px-12 xl:px-20 mr-4 w-full ' +
                    (!searchData || searchData === 'all' ? ' bg-white text-blue-700' : ' bg-transparent text-white')
                  }
                  onClick={() => {
                    router.push(pathName + '?' + createQueryString('line', 'all'));
                  }}
                >
                  All Lines
                </button>
              </li>
              {routeData &&
                routeData?.map((route) => (
                  <li key={route} style={{ color: 'white' }}>
                    <button
                      className={
                        'text-left font-medium rounded-l-2xl py-3 px-4 lg:px-12 xl:px-20 mr-4 w-full ' +
                        (searchData && route.toLowerCase().toString().trim() === searchData.toLowerCase().toString().trim()
                          ? ' bg-white text-blue-700'
                          : ' bg-transparent text-white')
                      }
                      onClick={() => {
                        router.push(pathName + '?' + createQueryString('line', route));
                      }}
                    >
                      {route}
                    </button>
                  </li>
                ))}
            </ul>
          </Suspense>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
