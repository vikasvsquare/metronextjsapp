import React, { Suspense, useCallback, useContext } from 'react';
import { Sidebar_data } from '@/store/context';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Loader from '@/components/ui/loader';
import Image from 'next/image';
import Link from 'next/link';

function MobileSideBar({ hideMegamenu, handleMegamenuToggle, handleInnerMenuToggle, showInnerMenu }) {
  // const { sideBarData } = useContext(Sidebar_data);
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const searchData = searchParams.get('line');

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <>
      <div
        className="absolute w-full h-full min-h-screen top-0 right-0 overflow-hidden flex justify-end bg-black/40"
        onClick={hideMegamenu} style={{zIndex: '9999'}}
      >
        <div
          className="relative right-0 overflow-y-scroll pt-6 pr-4 bg-gradient-to-b from-[#050708] from-[-2.29%] to-[#0089E3] to-[90.57%] w-4/5 md:w-2/5 lg:w-2/5 min-h-screen rounded-tl-3xl rounded-bl-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-end items-center pl-4 sm:pr-4 lg:pr-10 min-h-10 md:min-h-24">
            <button className="relative inline-block h-5 md:h-10 w-5 md:w-10" onClick={handleMegamenuToggle}>
              <span className="absolute top-1/2 -transform-y-1/2 left-0 rotate-45 bg-white h-[1px] w-full  rounded"></span>
              <span className="absolute top-1/2 -transform-y-1/2 left-0 -rotate-45 bg-white h-[1px] w-full rounded"></span>
            </button>
          </div>
          <div className="mt-4">
            <div>
              <div
                className={`flex flex-wrap items-center rounded-tr-lg rounded-br-lg ${pathName === '/crime/rail' ? 'bg-sky-900' : 'bg-transparent'
                  }`}
              >
                <div className="basis-full flex items-center pr-4">
                  <Link href="/crime/rail" className="flex-auto px-8 py-4 flex items-center">
                    <span className="inline-block max-w-9 h-5 mr-4">
                      <Image
                        className="object-contain w-auto h-auto relative -translate-y-1/4"
                        alt="rail"
                        src="/assets/rail.png"
                        width={18}
                        height={23}
                        priority
                      />
                    </span>
                    <span className="text-white">Rail</span>
                  </Link>
                  <button className="inline-block h-6 w-6" onClick={() => handleInnerMenuToggle('rail')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="none"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m17 10l-5 5l-5-5"
                      />
                    </svg>
                  </button>
                </div>
                {showInnerMenu.rail && (
                  <ul className="flex basis-full flex-col bg-sky-800 rounded-lg mb-4 px-8 py-4 mx-4">
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/" className={'text-white uppercase hover:text-white' + (pathName === `/` ? ' font-extrabold' : ' font-normal')}>
                        Crime
                      </Link>
                    </li>
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/calls-for-service/rail" className={'text-white uppercase hover:text-white' + (pathName === `/calls-for-service/rail` ? ' font-extrabold' : ' font-normal')}>
                        Calls for Service
                      </Link>
                    </li>
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/arrests/rail" className={'text-white uppercase hover:text-white' + (pathName === `/arrests/rail` ? ' font-extrabold' : ' font-normal')}>
                        Arrest
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div>
              <div
                className={`flex flex-wrap items-center rounded-tr-lg rounded-br-lg ${pathName === '/crime/bus' ? 'bg-sky-900' : 'bg-transparent'
                  }`}
              >
                <div className="basis-full flex items-center pr-4">
                  <Link href="/crime/bus" className="flex-auto px-8 py-4 flex items-center">
                    <span className="inline-block max-w-9 h-5 mr-4">
                      <Image
                        className="object-contain w-auto h-auto relative -translate-y-1/4"
                        alt="bus"
                        src="/assets/bus.png"
                        width={18}
                        height={23}
                        priority
                      />
                    </span>
                    <span className="text-white">Bus</span>
                  </Link>
                  <button className="inline-block h-6 w-6" onClick={() => handleInnerMenuToggle('bus')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="none"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m17 10l-5 5l-5-5"
                      />
                    </svg>
                  </button>
                </div>
                {showInnerMenu.bus && (
                  <ul className="flex basis-full flex-col bg-sky-800 rounded-lg mb-4 px-8 py-4 mx-4">
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/crime/bus"
                        className={
                          'text-white uppercase hover:text-white ' +
                          (pathName === `/crime/bus`
                            ? 'font-extrabold'
                            : 'font-normal')
                        }>
                        Crime
                      </Link>
                    </li>
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/calls-for-service/bus"
                        className={
                          'text-white uppercase hover:text-white ' +
                          (pathName === `/calls-for-service/bus`
                            ? 'font-extrabold'
                            : 'font-normal')
                        }>
                        Calls for Service
                      </Link>
                    </li>
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/arrests/bus"
                        className={
                          'text-white uppercase hover:text-white ' +
                          (pathName === `/arrests/bus`
                            ? 'font-extrabold'
                            : 'font-normal')
                        }>
                        Arrest
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <div>
              <div
                className={`flex flex-wrap items-center rounded-tr-lg rounded-br-lg ${pathName === '/crime/system-wide' ? 'bg-sky-900' : 'bg-transparent'
                  }`}
              >
                <div className="basis-full flex items-center pr-4">
                  <Link href="/crime/system-wide" className="flex-auto px-8 py-4 flex items-center">
                    <span className="inline-block max-w-9 h-5 mr-4">
                      <Image
                        className="object-contain w-auto h-auto relative -translate-y-1/4"
                        alt="system-wide"
                        src="/assets/system-wide.png"
                        width={18}
                        height={23}
                        priority
                      />
                    </span>
                    <span className="text-white">Systemwide</span>
                  </Link>
                  <button className="inline-block h-6 w-6" onClick={() => handleInnerMenuToggle('systemWide')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="w-full h-full">
                      <path
                        fill="none"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m17 10l-5 5l-5-5"
                      />
                    </svg>
                  </button>
                </div>
                {showInnerMenu.systemWide && (
                  <ul className="flex basis-full flex-col bg-sky-800 rounded-lg mb-4 px-8 py-4 mx-4">
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/crime/system-wide" className={'text-white uppercase hover:text-white' + (pathName === `/crime/system-wide` ? ' font-extrabold' : '')}>
                        Crime
                      </Link>
                    </li>
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/calls-for-service/system-wide" className={'text-white uppercase hover:text-white' + (pathName === `/calls-for-service/system-wide` ? ' font-extrabold' : '')}>
                        Calls for Service
                      </Link>
                    </li>
                    <li className="block p-3 border-b border-solid border-slate-50">
                      <Link href="/arrests/system-wide" className={'text-white uppercase hover:text-white' + (pathName === `/arrests/system-wide` ? ' font-extrabold' : '')}>
                        Arrest
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileSideBar;
