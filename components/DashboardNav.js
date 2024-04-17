'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MobileSideBar from './MobileSideBar';
import CustomDropdown from './ui/CustomDropdown';

export default function DashboardNav() {
  const pathName = usePathname();
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [showMegamenu, setShowMegamenu] = useState(false);
  const [showInnerMenu, setShowInnerMenu] = useState({
    rail: false,
    bus: false,
    systemWide: false
  });

  const [statType, transportType] = pathName.substring(1).split('/');

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
                <CustomDropdown />
                {/* <h2
                  className="font-scala-sans font-bold italic text-lg flex items-center px-4 md:px-10 py-1 md:py-5"
                  onClick={handleDropdownToggle}
                >
                  {statType === 'crime' && <span className="opacity-40">CRIME</span>}
                  {statType === 'arrest' && <span className="opacity-40">ARREST</span>}
                  {statType === 'call-for-service' && <span className="opacity-40">CALLS FOR SERVICE</span>}
                  <span className="max-w-12 lg:max-w-16 h-7 lg:h-14 ml-5">
                    {transportType === 'rail' && (
                      <Image
                        className="object-contain h-full"
                        alt="Crime Systemwide"
                        src="/assets/metro-group.svg"
                        width={99.44}
                        height={57.64}
                        priority
                      />
                    )}
                    {transportType === 'bus' && (
                      <Image
                        className="object-contain h-full"
                        alt="Crime Systemwide"
                        src="/assets/metro-bus.svg"
                        width={99.44}
                        height={57.64}
                        priority
                      />
                    )}
                    {transportType === 'system-wide' && (
                      <Image
                        className="object-contain h-full"
                        alt="Crime Systemwide"
                        src="/assets/metro-system-wide.svg"
                        width={99.44}
                        height={57.64}
                        priority
                      />
                    )}
                  </span>
                </h2>
                
                {isDropdownActive && (
                  <ul className="bg-sky-50 rounded-lg px-4 md:px-10 py-1 md:py-5 absolute left-0 right-0 top-full">
                    {statType !== 'crime' && (
                      <li>
                        <Link href={`/crime/rail`}>
                          <h2 className="font-scala-sans font-bold italic text-lg flex items-center">
                            <span className="opacity-40">CRIME</span>
                            <span className="max-w-12 lg:max-w-16 h-7 lg:h-14 ml-5">
                            </span>
                          </h2>
                        </Link>
                      </li>
                    )}
                    {statType !== 'call-for-service' && (
                      <li>
                        <Link href={`/call-for-service/rail`}>
                          <h2 className="font-scala-sans font-bold italic text-lg flex items-center">
                            <span className="opacity-40">CALLS FOR SERVICE</span>
                            <span className="max-w-12 lg:max-w-16 h-7 lg:h-14 ml-5">
                            </span>
                          </h2>
                        </Link>
                      </li>
                    )}
                  </ul>
                )} */}
              </div>
              <div className="hidden xl:flex xl:items-center xl:basis-7/12 xl:gap-2 2xl:basis-6/12 bg-slate-100 p-2 rounded-lg">
                <Link
                  href={`/${statType}/rail`}
                  className={
                    'flex-auto bg-white rounded-lg px-4 py-2 flex items-center hover:no-underline ' +
                    (pathName === `/${statType}/rail`
                      ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white hover:text-white'
                      : 'text-black hover:text-black')
                  }
                >
                  <span className="inline-block max-w-9 h-5 mr-4">
                    <svg width="16" height="25" viewBox="0 0 16 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4.87527 2.59736C2.09677 3.17202 1.21173 3.76917 0.967712 5.39207V18.9778C1.58191 20.0056 2.02892 20.4622 3.11856 20.9284H12.9269C14.0013 20.2909 14.4444 19.872 14.875 18.9778V17.6546V5.39207C14.5922 3.67238 13.6625 3.09183 10.9224 2.59736C8.56211 2.3786 7.23558 2.37082 4.87527 2.59736Z"
                        fill={`${pathName === `/${statType}/rail` ? 'white' : '#8E8E8E'}`}
                      />
                      <ellipse
                        cx="6.78568"
                        cy="0.888897"
                        rx="0.900909"
                        ry="0.888897"
                        fill={`${pathName === `/${statType}/rail` ? 'white' : '#8E8E8E'}`}
                      />
                      <ellipse
                        cx="3.39243"
                        cy="15.3966"
                        rx="0.962012"
                        ry="0.949185"
                        fill={`${pathName === `/${statType}/rail` ? '#016FB7' : 'white'}`}
                      />
                      <ellipse
                        cx="12.4839"
                        cy="15.3966"
                        rx="0.962012"
                        ry="0.949185"
                        fill={`${pathName === `/${statType}/rail` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M3.57809 21.2997H2.28413L0 24.2365H1.33897L2.16036 23.2576H13.6598L14.3461 24.2365H15.9214L13.6598 21.2997H12.3208L13.1872 22.3012H2.7342L3.57809 21.2997Z"
                        fill={`${pathName === `/${statType}/rail` ? 'white' : '#8E8E8E'}`}
                      />
                      <ellipse
                        cx="9.0361"
                        cy="0.888897"
                        rx="0.900909"
                        ry="0.888897"
                        fill={`${pathName === `/${statType}/rail` ? 'white' : '#8E8E8E'}`}
                      />
                      <path
                        d="M3.3194 6.211C2.75944 6.30227 2.52996 6.44118 2.41925 6.99863V11.0943C2.7918 12.1746 3.16706 12.5221 4.06202 12.6583H11.8708C12.8418 12.3225 13.1756 11.9906 13.4236 11.1618V6.99863C13.4281 6.47958 13.2624 6.3112 12.7147 6.211H3.3194Z"
                        fill={`${pathName === `/${statType}/rail` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M7.88189 18.273C5.16213 18.2693 0.967712 17.5754 0.967712 17.5754V18.4132C0.967712 18.4132 5.1559 19.2477 7.88189 19.2519C10.6384 19.2562 14.8638 18.4193 14.8638 18.4193V17.5754C14.8638 17.5754 10.6323 18.2767 7.88189 18.273Z"
                        fill={`${pathName === `/${statType}/rail` ? '#016FB7' : 'white'}`}
                      />
                      <rect
                        x="5.24347"
                        y="3.91565"
                        width="5.35589"
                        height="0.900149"
                        rx="0.450075"
                        fill={`${pathName === `/${statType}/rail` ? 'white' : '#8E8E8E'}`}
                      />
                    </svg>
                  </span>
                  <span>Rail</span>
                </Link>
                <Link
                  href={`/${statType}/bus`}
                  // href="#"
                  className={
                    'flex-auto bg-white rounded-lg px-4 py-2 flex items-center hover:no-underline ' +
                    (pathName === `/${statType}/bus`
                      ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white hover:text-white'
                      : 'text-black hover:text-black')
                  }
                >
                  <span className="inline-block max-w-9 h-5 mr-4">
                    <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.79906 3.35827V5.04195C0.808653 5.01605 0 5.41443 0 6.13608V7.4371C-1.98518e-05 8.81942 0.841627 9.41517 1.71774 9.58993V15.452V17.3205C1.82351 17.6373 2.05292 17.6884 2.6935 17.6079V19.2095C2.79411 19.7476 2.96448 19.8602 3.30335 20H4.79748C5.17134 19.8283 5.28067 19.6365 5.38701 19.2095V17.6079H13.3252V19.2095C13.4471 19.665 13.5985 19.8422 14.0367 20H15.4699C15.8645 19.8192 15.9718 19.6363 16.0187 19.2095V17.6079C16.6798 17.6381 16.8749 17.5337 16.8623 17.1049V14.5794V9.58993C17.9807 9.3899 18.7834 8.90073 18.7834 7.4371V6.13608C18.7834 5.04195 17.8802 4.9372 16.8623 5.04195V3.35827C16.8623 0.945684 14.6567 0.0781543 12.1665 0.0781543C9.72932 -0.0213499 8.36289 -0.0306493 5.92571 0.0781543C4.04534 0.1621 1.79906 1.3666 1.79906 3.35827Z"
                        fill={`${pathName === `/${statType}/bus` ? 'white' : '#8E8E8E'}`}
                      />
                      <path
                        d="M9.43232 15.5379C6.38306 15.5543 1.69739 14.4707 1.69739 14.4707V15.4058C1.69739 15.4058 6.38249 16.4731 9.43232 16.4832C12.3612 16.4929 16.8725 15.5379 16.8725 15.5379V14.4707C16.8725 14.4707 12.3676 15.5222 9.43232 15.5379Z"
                        fill={`${pathName === `/${statType}/bus` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M16.1002 3.88983H2.67334V9.4293C3.07527 10.2576 3.40077 10.487 4.10649 10.5982H14.7585C15.5952 10.3579 15.8597 10.0817 16.1002 9.4293V3.88983Z"
                        fill={`${pathName === `/${statType}/bus` ? '#016FB7' : 'white'}`}
                      />
                      <rect
                        x="6.20032"
                        y="1.58258"
                        width="6.2408"
                        height="1.01642"
                        rx="0.508208"
                        fill={`${pathName === `/${statType}/bus` ? '#016FB7' : 'white'}`}
                      />
                      <ellipse
                        cx="4.04544"
                        cy="12.8017"
                        rx="0.874118"
                        ry="0.851705"
                        fill={`${pathName === `/${statType}/bus` ? '#016FB7' : 'white'}`}
                      />
                      <ellipse
                        cx="14.6975"
                        cy="12.8017"
                        rx="0.874118"
                        ry="0.851705"
                        fill={`${pathName === `/${statType}/bus` ? '#016FB7' : 'white'}`}
                      />
                    </svg>
                  </span>
                  <span>Bus</span>
                </Link>
                <Link
                  href={`/${statType}/system-wide`}
                  // href="#"
                  className={
                    'flex-auto bg-white rounded-lg px-4 py-2 flex items-center hover:no-underline ' +
                    (pathName === `/${statType}/system-wide`
                      ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white hover:text-white'
                      : 'text-black hover:text-black')
                  }
                >
                  <span className="inline-block max-w-9 h-5 mr-4">
                    <svg width="35" height="26" viewBox="0 0 35 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M19.577 10.7999V12.3288C18.6777 12.3052 17.9434 12.667 17.9434 13.3223V14.5037C17.9433 15.759 18.7076 16.3 19.5032 16.4587V21.7818V23.4785C19.5992 23.7662 19.8076 23.8126 20.3893 23.7396V25.1939C20.4806 25.6825 20.6353 25.7848 20.943 25.9117H22.2998C22.6393 25.7558 22.7386 25.5816 22.8351 25.1939V23.7396H30.0436V25.1939C30.1543 25.6075 30.2917 25.7684 30.6897 25.9117H31.9911C32.3495 25.7475 32.4469 25.5815 32.4895 25.1939V23.7396C33.0898 23.7669 33.267 23.6721 33.2556 23.2828V20.9894V16.4587C34.2711 16.277 35 15.8328 35 14.5037V13.3223C35 12.3288 34.1799 12.2336 33.2556 12.3288V10.7999C33.2556 8.60905 31.2527 7.82127 28.9914 7.82127C26.7783 7.73092 25.5375 7.72247 23.3243 7.82127C21.6168 7.8975 19.577 8.99128 19.577 10.7999Z"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
                      />
                      <path
                        d="M26.5086 21.8599C23.7397 21.8747 19.4847 20.8907 19.4847 20.8907V21.7399C19.4847 21.7399 23.7392 22.709 26.5086 22.7182C29.1683 22.7271 33.2648 21.8599 33.2648 21.8599V20.8907C33.2648 20.8907 29.174 21.8456 26.5086 21.8599Z"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M32.5634 11.2825H20.3708V16.3128C20.7358 17.0649 21.0314 17.2733 21.6722 17.3742H31.3451C32.1048 17.156 32.345 16.9052 32.5634 16.3128V11.2825Z"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <rect
                        x="23.5736"
                        y="9.18732"
                        width="5.66709"
                        height="0.922979"
                        rx="0.461489"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <ellipse
                        cx="21.6168"
                        cy="19.3752"
                        rx="0.793762"
                        ry="0.773409"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <ellipse
                        cx="31.2896"
                        cy="19.3752"
                        rx="0.793762"
                        ry="0.773409"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M4.66875 2.48751C2.0078 3.03786 1.16021 3.60975 0.926514 5.16399V18.175C1.51472 19.1593 1.94283 19.5966 2.98636 20.043H12.3797C13.4087 19.4325 13.833 19.0313 14.2454 18.175V16.9077V5.16399C13.9745 3.51705 13.0842 2.96107 10.4601 2.48751C8.19961 2.27801 6.9292 2.27056 4.66875 2.48751Z"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
                      />
                      <ellipse
                        cx="6.49841"
                        cy="0.851291"
                        rx="0.862794"
                        ry="0.851291"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
                      />
                      <ellipse
                        cx="3.24883"
                        cy="14.7452"
                        rx="0.921312"
                        ry="0.909027"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <ellipse
                        cx="11.9557"
                        cy="14.7452"
                        rx="0.921312"
                        ry="0.909027"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M3.42671 20.3986H2.18749L0 23.2111H1.28232L2.06896 22.2736H13.0819L13.7392 23.2111H15.2478L13.0819 20.3986H11.7995L12.6293 21.3577H2.61853L3.42671 20.3986Z"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
                      />
                      <ellipse
                        cx="8.65357"
                        cy="0.851291"
                        rx="0.862794"
                        ry="0.851291"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
                      />
                      <path
                        d="M3.17872 5.94824C2.64245 6.03565 2.42267 6.16869 2.31665 6.70255V10.625C2.67344 11.6595 3.03282 11.9924 3.88992 12.1228H11.3683C12.2982 11.8011 12.6179 11.4833 12.8554 10.6896V6.70255C12.8598 6.20546 12.701 6.04421 12.1765 5.94824H3.17872Z"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <path
                        d="M7.54817 17.4999C4.94348 17.4964 0.926514 16.8318 0.926514 16.8318V17.6343C0.926514 17.6343 4.93751 18.4334 7.54817 18.4374C10.1881 18.4415 14.2347 17.64 14.2347 17.64V16.8318C14.2347 16.8318 10.1822 17.5035 7.54817 17.4999Z"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                      <rect
                        x="5.02136"
                        y="3.75006"
                        width="5.1293"
                        height="0.862066"
                        rx="0.431033"
                        fill={`${pathName === `/${statType}/system-wide` ? '#016FB7' : 'white'}`}
                      />
                    </svg>
                  </span>
                  <span>Systemwide</span>
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
          <MobileSideBar
            hideMegamenu={hideMegamenu}
            handleMegamenuToggle={handleMegamenuToggle}
            handleInnerMenuToggle={handleInnerMenuToggle}
            showInnerMenu={showInnerMenu}
          />
        )}
      </header>
    </>
  );
}
