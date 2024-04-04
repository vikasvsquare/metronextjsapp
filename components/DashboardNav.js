'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardNav() {
  const pathName = usePathname();
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [showMegamenu, setShowMegamenu] = useState(false);
  const [showInnerMenu, setShowInnerMenu] = useState({
    rail: false,
    bus: false,
    systemWide: false
  });

  // console.log(pathName);

  function handleDropdownToggle() {
    setIsDropdownActive((prevDatePickerState) => !prevDatePickerState);
  }

  function handleMegamenuToggle() {
    document.body.classList.toggle('overflow-hidden');
    setShowMegamenu((prevMegamenuState) => !prevMegamenuState);
  }

  function hideMegamenu() {
    document.body.classList.remove('overflow-hidden');
    setShowMegamenu(false);
  }

  function handleInnerMenuToggle(type) {
    setShowInnerMenu((prevInnerMenuState) => {
      const newInnerMenuState = { ...prevInnerMenuState };
      newInnerMenuState[type] = !prevInnerMenuState[type];
      return newInnerMenuState;
    });
  }

  return (
    <>
      <header className="relative z-30">
        <div className="container">
          <div className="flex items-center justify-between gap-x-2 lg:gap-x-6">
            <div className="basis-1/5 lg:basis-3/12">
              <Link href="/">
                <Image
                  className="hidden lg:inline-block h-auto max-w-44 w-auto"
                  alt="Metro logo"
                  src="/assets/metro-logo.png"
                  width={184}
                  height={65.71}
                  priority
                />
                <Image
                  className="inline-block lg:hidden max-h-16 h-auto w-auto"
                  alt="Metro logo"
                  src="/assets/metro-logo-vertical.png"
                  width={80}
                  height={110}
                  priority
                />
              </Link>
            </div>
            <div className="basis-4/5 lg:basis-9/12 flex items-center lg:gap-x-12 py-6 lg:py-6 lg:pl-6 border-0 lg:border-l lg:border-b border-solid border-[#0099ff] rounded-bl-3xl relative">
              <div className="basis-9/12 xl:basis-5/12 2xl:basis-6/12 bg-sky-50 rounded-lg relative">
                <h2
                  className="font-scala-sans font-bold italic text-2xl lg:text-5xl flex items-center px-4 md:px-10 py-1 md:py-5"
                  onClick={handleDropdownToggle}
                >
                  <span className="opacity-40">CRIME</span>
                  <span className="max-w-12 lg:max-w-16 h-7 lg:h-14 ml-5">
                    <Image
                      className="object-contain h-full"
                      alt="Crime System Wide"
                      src="/assets/metro-group.svg"
                      width={99.44}
                      height={57.64}
                      priority
                    />
                  </span>
                </h2>
                {isDropdownActive && (
                  <ul className="bg-sky-50 rounded-lg px-4 md:px-10 py-1 md:py-5 absolute left-0 right-0 top-full">
                    <li>
                      <h2 className="font-scala-sans font-bold italic text-2xl lg:text-5xl flex items-center">
                        <span className="opacity-40">ARREST</span>
                        <span className="max-w-12 lg:max-w-16 h-7 lg:h-14 ml-5">
                          {/* <img src={logoTrain} className="object-contain h-full" alt="Crime System Wide" /> */}
                        </span>
                      </h2>
                    </li>
                    <li>
                      <h2 className="font-scala-sans font-bold italic text-2xl lg:text-5xl flex items-center">
                        <span className="opacity-40">CALL FOR SERVICE</span>
                        <span className="max-w-12 lg:max-w-16 h-7 lg:h-14 ml-5">
                          {/* <img src={logoTrain} className="object-contain h-full" alt="Crime System Wide" /> */}
                        </span>
                      </h2>
                    </li>
                  </ul>
                )}
              </div>
              <div className="hidden xl:flex xl:items-center xl:basis-7/12 xl:gap-2 2xl:basis-6/12 bg-slate-100 p-2 rounded-lg">
                <Link
                  href="/crime/rail"
                  className={
                    'flex-auto bg-white rounded-lg px-4 py-2 flex items-center  ' +
                    (pathName === '/crime/rail'
                      ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white'
                      : 'text-black')
                  }
                >
                  <span className="inline-block max-w-9 h-5 mr-4">
                    <Image className="object-contain w-auto h-auto" alt="rail" src="/assets/rail.svg" width={18} height={23} priority />
                  </span>
                  <span>Rail</span>
                </Link>
                <Link
                  // href="/crime/bus"
                  href="#"
                  className={
                    'flex-auto bg-white rounded-lg px-4 py-2 flex items-center  ' +
                    (pathName === '/crime/bus'
                      ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white'
                      : 'text-black')
                  }
                >
                  <span className="inline-block max-w-9 h-5 mr-4">
                    <Image className="object-contain w-auto h-auto" alt="bus" src="/assets/bus.svg" width={18} height={23} priority />
                  </span>
                  <span>Bus</span>
                </Link>
                <Link
                  // href="/crime/system-wide"
                  href="#"
                  className={
                    'flex-auto bg-white rounded-lg px-4 py-2 flex items-center  ' +
                    (pathName === '/crime/system-wide'
                      ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white'
                      : 'text-black')
                  }
                >
                  <span className="inline-block max-w-9 h-5 mr-4">
                    <Image
                      className="object-contain w-auto h-auto"
                      alt="system wide"
                      src="/assets/system-wide.svg"
                      width={32}
                      height={23}
                      priority
                    />
                  </span>
                  <span>System Wide</span>
                </Link>
              </div>
              <div className="basis-3/12 flex justify-end items-center xl:hidden">
                <button className="flex flex-col justify-between items-end h-5 w-10" onClick={handleMegamenuToggle}>
                  <span className="bg-sky-950 h-1 w-full rounded"></span>
                  <span className="bg-sky-950 h-1 w-3/5 rounded"></span>
                  <span className="bg-sky-950 h-1 w-4/5 rounded"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {showMegamenu && (
          <div
            className="absolute w-full h-full min-h-screen top-0 right-0 overflow-hidden flex justify-end bg-black/40"
            onClick={hideMegamenu}
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
                    className={`flex flex-wrap items-center rounded-tr-lg rounded-br-lg ${
                      pathName === '/crime/rail' ? 'bg-sky-900' : 'bg-transparent'
                    }`}
                  >
                    <div className="basis-full flex items-center pr-4">
                      <Link href="/crime/rail" className="flex-auto px-8 py-4 flex items-center">
                        <span className="inline-block max-w-9 h-5 mr-4">
                          <Image
                            className="object-contain w-auto h-auto"
                            alt="rail"
                            src="/assets/rail.svg"
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
                          <Link href="" className="text-white uppercase">
                            Call for Service
                          </Link>
                        </li>
                        <li className="block p-3 border-b border-solid border-slate-50">
                          <Link href="" className="text-white uppercase">
                            Crime
                          </Link>
                        </li>
                        <li className="block p-3 border-b border-solid border-slate-50">
                          <Link href="" className="text-white uppercase">
                            Arrest
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <div
                    className={`flex flex-wrap items-center rounded-tr-lg rounded-br-lg ${
                      pathName === '/crime/bus' ? 'bg-sky-900' : 'bg-transparent'
                    }`}
                  >
                    <div className="basis-full flex items-center pr-4">
                      <Link href="/crime/bus" className="flex-auto px-8 py-4 flex items-center">
                        <span className="inline-block max-w-9 h-5 mr-4">
                          <Image
                            className="object-contain w-auto h-auto"
                            alt="bus"
                            src="/assets/bus.svg"
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
                          <Link href="" className="text-white uppercase">
                            Call for Service
                          </Link>
                        </li>
                        <li className="block p-3 border-b border-solid border-slate-50">
                          <Link href="" className="text-white uppercase">
                            Crime
                          </Link>
                        </li>
                        <li className="block p-3 border-b border-solid border-slate-50">
                          <Link href="" className="text-white uppercase">
                            Arrest
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <div
                    className={`flex flex-wrap items-center rounded-tr-lg rounded-br-lg ${
                      pathName === '/crime/system-wide' ? 'bg-sky-900' : 'bg-transparent'
                    }`}
                  >
                    <div className="basis-full flex items-center pr-4">
                      <Link href="/crime/system-wide" className="flex-auto px-8 py-4 flex items-center">
                        <span className="inline-block max-w-9 h-5 mr-4">
                          <Image
                            className="object-contain w-auto h-auto"
                            alt="system-wide"
                            src="/assets/system-wide.svg"
                            width={18}
                            height={23}
                            priority
                          />
                        </span>
                        <span className="text-white">System Wide</span>
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
                          <Link href="" className="text-white uppercase">
                            Call for Service
                          </Link>
                        </li>
                        <li className="block p-3 border-b border-solid border-slate-50">
                          <Link href="" className="text-white uppercase">
                            Crime
                          </Link>
                        </li>
                        <li className="block p-3 border-b border-solid border-slate-50">
                          <Link href="" className="text-white uppercase">
                            Arrest
                          </Link>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="pl-4 my-8">
                <ul>
                  <li>
                    <button className="bg-transparent text-white font-bold rounded-l-2xl py-3 px-4 mr-4">All Lines</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white font-medium rounded-l-2xl py-3 px-4 mr-4">A Line</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white font-medium rounded-l-2xl py-3 px-4 mr-4">B Line</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white font-medium rounded-l-2xl py-3 px-4 mr-4">C Line</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white font-medium rounded-l-2xl py-3 px-4 mr-4">D Line</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white font-medium rounded-l-2xl py-3 px-4 mr-4">E Line</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white font-medium rounded-l-2xl py-3 px-4 mr-4">K Line</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
