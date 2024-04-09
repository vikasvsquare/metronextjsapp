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
                    <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.7095 0.710938C1.27385 0.710938 0.856049 0.883997 0.548001 1.19204C0.239954 1.50009 0.0668945 1.91789 0.0668945 2.35354V15.4943C0.0668945 15.93 0.239954 16.3478 0.548001 16.6558C0.856049 16.9639 1.27385 17.1369 1.7095 17.1369H16.4929C16.9285 17.1369 17.3464 16.9639 17.6544 16.6558C17.9624 16.3478 18.1355 15.93 18.1355 15.4943V2.35354C18.1355 1.91789 17.9624 1.50009 17.6544 1.19204C17.3464 0.883997 16.9285 0.710938 16.4929 0.710938H1.7095ZM6.22665 1.53224H11.9922C12.1011 1.53224 12.2055 1.5755 12.2826 1.65251C12.3596 1.72953 12.4028 1.83398 12.4028 1.94289C12.4028 2.0518 12.3596 2.15625 12.2826 2.23326C12.2055 2.31027 12.1011 2.35354 11.9922 2.35354H6.22665C6.11774 2.35354 6.01329 2.31027 5.93627 2.23326C5.85926 2.15625 5.816 2.0518 5.816 1.94289C5.816 1.83398 5.85926 1.72953 5.93627 1.65251C6.01329 1.5755 6.11774 1.53224 6.22665 1.53224ZM2.5308 3.99614H8.2799V10.5665H2.5308C2.31297 10.5665 2.10407 10.48 1.95005 10.326C1.79603 10.172 1.7095 9.96307 1.7095 9.74524V4.81744C1.7095 4.59962 1.79603 4.39072 1.95005 4.23669C2.10407 4.08267 2.31297 3.99614 2.5308 3.99614ZM9.9225 3.99614H15.6716C15.8894 3.99614 16.0983 4.08267 16.2524 4.23669C16.4064 4.39072 16.4929 4.59962 16.4929 4.81744V9.74524C16.4929 9.96307 16.4064 10.172 16.2524 10.326C16.0983 10.48 15.8894 10.5665 15.6716 10.5665H9.9225V3.99614ZM4.9947 12.2091C5.43034 12.2091 5.84814 12.3822 6.15619 12.6903C6.46424 12.9983 6.6373 13.4161 6.6373 13.8517C6.6373 14.2874 6.46424 14.7052 6.15619 15.0132C5.84814 15.3213 5.43034 15.4943 4.9947 15.4943C4.55905 15.4943 4.14125 15.3213 3.8332 15.0132C3.52516 14.7052 3.3521 14.2874 3.3521 13.8517C3.3521 13.4161 3.52516 12.9983 3.8332 12.6903C4.14125 12.3822 4.55905 12.2091 4.9947 12.2091ZM13.2077 12.2091C13.6433 12.2091 14.0611 12.3822 14.3692 12.6903C14.6772 12.9983 14.8503 13.4161 14.8503 13.8517C14.8503 14.2874 14.6772 14.7052 14.3692 15.0132C14.0611 15.3213 13.6433 15.4943 13.2077 15.4943C12.7721 15.4943 12.3543 15.3213 12.0462 15.0132C11.7382 14.7052 11.5651 14.2874 11.5651 13.8517C11.5651 13.4161 11.7382 12.9983 12.0462 12.6903C12.3543 12.3822 12.7721 12.2091 13.2077 12.2091ZM13.9387 18.7697C13.8125 18.7817 13.6908 18.8226 13.583 18.8891C13.4751 18.9555 13.3839 19.0459 13.3165 19.1532C13.249 19.2605 13.2071 19.3818 13.194 19.5078C13.1808 19.6338 13.1967 19.7612 13.2406 19.8801L13.5198 20.4221H4.6826L4.89614 19.9786C4.97011 19.7831 4.96672 19.5667 4.88667 19.3736C4.80662 19.1805 4.65594 19.0251 4.46534 18.9393C4.27473 18.8534 4.05855 18.8434 3.86086 18.9114C3.66316 18.9794 3.49884 19.1202 3.40137 19.3052L1.75877 22.5904C1.72386 22.685 1.70714 22.7853 1.7095 22.8861C1.7095 23.1039 1.79603 23.3128 1.95005 23.4668C2.10407 23.6208 2.31297 23.7074 2.5308 23.7074C2.67612 23.7066 2.81851 23.6664 2.94287 23.5912C3.06722 23.5161 3.1689 23.4086 3.23711 23.2803V23.1981H3.3521L3.8613 22.0648H14.3411L14.8503 23.1981V23.2803C14.9185 23.4086 15.0202 23.5161 15.1446 23.5912C15.2689 23.6664 15.4113 23.7066 15.5566 23.7074C15.7744 23.7074 15.9833 23.6208 16.1374 23.4668C16.2914 23.3128 16.3779 23.1039 16.3779 22.8861C16.4106 22.7567 16.4106 22.6212 16.3779 22.4918L14.7353 19.2066C14.6603 19.0635 14.5446 18.9457 14.4029 18.868C14.2612 18.7902 14.0997 18.7561 13.9387 18.7697Z"
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
                    <svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0.476562 3.7852C0.476562 1.97834 1.9549 0.5 3.76176 0.5H15.26C17.0668 0.5 18.5452 1.97834 18.5452 3.7852V16.926C18.5452 18.5686 16.9026 18.5686 16.9026 18.5686V20.2112C16.9026 21.1146 16.1634 21.8538 15.26 21.8538C14.3565 21.8538 13.6174 21.1146 13.6174 20.2112V18.5686H5.40437V20.2112C5.40437 21.1146 4.66519 21.8538 3.76176 21.8538C2.85833 21.8538 2.11916 21.1146 2.11916 20.2112V18.5686C0.476562 18.5686 0.476562 16.926 0.476562 16.926V3.7852ZM2.94046 5.4278C2.48054 5.4278 2.11916 5.78918 2.11916 6.2491V11.1769C2.11916 11.6368 2.48054 11.9982 2.94046 11.9982H16.0813C16.5412 11.9982 16.9026 11.6368 16.9026 11.1769V6.2491C16.9026 5.78918 16.5412 5.4278 16.0813 5.4278H2.94046ZM3.76176 13.6408C2.85833 13.6408 2.11916 14.38 2.11916 15.2834C2.11916 16.1868 2.85833 16.926 3.76176 16.926C4.66519 16.926 5.40437 16.1868 5.40437 15.2834C5.40437 14.38 4.66519 13.6408 3.76176 13.6408ZM15.26 13.6408C14.3565 13.6408 13.6174 14.38 13.6174 15.2834C13.6174 16.1868 14.3565 16.926 15.26 16.926C16.1634 16.926 16.9026 16.1868 16.9026 15.2834C16.9026 14.38 16.1634 13.6408 15.26 13.6408ZM3.76176 2.9639C3.76176 3.42383 4.12314 3.7852 4.58307 3.7852H14.4387C14.8986 3.7852 15.26 3.42383 15.26 2.9639C15.26 2.50397 14.8986 2.1426 14.4387 2.1426H4.58307C4.12314 2.1426 3.76176 2.50397 3.76176 2.9639Z"
                        fill={`${pathName === `/${statType}/bus` ? 'white' : '#8E8E8E'}`}
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
                    <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18.6426 0C18.207 0 17.7892 0.173059 17.4811 0.481107C17.1731 0.789154 17 1.20696 17 1.6426V14.7834C17 15.2191 17.1731 15.6369 17.4811 15.9449C17.7892 16.253 18.207 16.426 18.6426 16.426H33.426C33.8617 16.426 34.2795 16.253 34.5875 15.9449C34.8956 15.6369 35.0686 15.2191 35.0686 14.7834V1.6426C35.0686 1.20696 34.8956 0.789154 34.5875 0.481107C34.2795 0.173059 33.8617 0 33.426 0H18.6426ZM23.1598 0.821301H28.9253C29.0342 0.821301 29.1386 0.864565 29.2157 0.941577C29.2927 1.01859 29.3359 1.12304 29.3359 1.23195C29.3359 1.34086 29.2927 1.44531 29.2157 1.52232C29.1386 1.59934 29.0342 1.6426 28.9253 1.6426H23.1598C23.0508 1.6426 22.9464 1.59934 22.8694 1.52232C22.7924 1.44531 22.7491 1.34086 22.7491 1.23195C22.7491 1.12304 22.7924 1.01859 22.8694 0.941577C22.9464 0.864565 23.0508 0.821301 23.1598 0.821301ZM19.4639 3.2852H25.213V9.85561H19.4639C19.2461 9.85561 19.0372 9.76908 18.8832 9.61505C18.7291 9.46103 18.6426 9.25213 18.6426 9.03431V4.1065C18.6426 3.88868 18.7291 3.67978 18.8832 3.52576C19.0372 3.37173 19.2461 3.2852 19.4639 3.2852ZM26.8556 3.2852H32.6047C32.8225 3.2852 33.0314 3.37173 33.1855 3.52576C33.3395 3.67978 33.426 3.88868 33.426 4.1065V9.03431C33.426 9.25213 33.3395 9.46103 33.1855 9.61505C33.0314 9.76908 32.8225 9.85561 32.6047 9.85561H26.8556V3.2852ZM21.9278 11.4982C22.3634 11.4982 22.7812 11.6713 23.0893 11.9793C23.3973 12.2874 23.5704 12.7052 23.5704 13.1408C23.5704 13.5765 23.3973 13.9943 23.0893 14.3023C22.7812 14.6103 22.3634 14.7834 21.9278 14.7834C21.4922 14.7834 21.0744 14.6103 20.7663 14.3023C20.4583 13.9943 20.2852 13.5765 20.2852 13.1408C20.2852 12.7052 20.4583 12.2874 20.7663 11.9793C21.0744 11.6713 21.4922 11.4982 21.9278 11.4982ZM30.1408 11.4982C30.5765 11.4982 30.9943 11.6713 31.3023 11.9793C31.6103 12.2874 31.7834 12.7052 31.7834 13.1408C31.7834 13.5765 31.6103 13.9943 31.3023 14.3023C30.9943 14.6103 30.5765 14.7834 30.1408 14.7834C29.7052 14.7834 29.2874 14.6103 28.9793 14.3023C28.6713 13.9943 28.4982 13.5765 28.4982 13.1408C28.4982 12.7052 28.6713 12.2874 28.9793 11.9793C29.2874 11.6713 29.7052 11.4982 30.1408 11.4982ZM30.8718 18.0588C30.7456 18.0708 30.6239 18.1116 30.5161 18.1781C30.4082 18.2446 30.317 18.335 30.2496 18.4422C30.1822 18.5495 30.1402 18.6708 30.1271 18.7969C30.1139 18.9229 30.1298 19.0503 30.1737 19.1692L30.4529 19.7112H21.6157L21.8292 19.2677C21.9032 19.0722 21.8998 18.8558 21.8198 18.6627C21.7397 18.4695 21.589 18.3142 21.3984 18.2283C21.2078 18.1425 20.9917 18.1325 20.794 18.2005C20.5963 18.2685 20.4319 18.4093 20.3345 18.5942L18.6919 21.8794C18.657 21.974 18.6403 22.0743 18.6426 22.1751C18.6426 22.3929 18.7291 22.6018 18.8832 22.7559C19.0372 22.9099 19.2461 22.9964 19.4639 22.9964C19.6092 22.9956 19.7516 22.9555 19.876 22.8803C20.0003 22.8051 20.102 22.6977 20.1702 22.5693V22.4872H20.2852L20.7944 21.3538H31.2742L31.7834 22.4872V22.5693C31.8516 22.6977 31.9533 22.8051 32.0777 22.8803C32.202 22.9555 32.3444 22.9956 32.4897 22.9964C32.7076 22.9964 32.9165 22.9099 33.0705 22.7559C33.2245 22.6018 33.311 22.3929 33.311 22.1751C33.3437 22.0457 33.3437 21.9103 33.311 21.7809L31.6684 18.4957C31.5934 18.3526 31.4777 18.2347 31.336 18.157C31.1943 18.0793 31.0328 18.0451 30.8718 18.0588Z"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
                      />
                      <path
                        d="M0 11.6698C0 10.2014 1.20141 9 2.6698 9H12.0141C13.4825 9 14.6839 10.2014 14.6839 11.6698V22.349C14.6839 23.6839 13.349 23.6839 13.349 23.6839V25.0188C13.349 25.753 12.7483 26.3537 12.0141 26.3537C11.2799 26.3537 10.6792 25.753 10.6792 25.0188V23.6839H4.0047V25.0188C4.0047 25.753 3.40399 26.3537 2.6698 26.3537C1.9356 26.3537 1.3349 25.753 1.3349 25.0188V23.6839C0 23.6839 0 22.349 0 22.349V11.6698ZM2.00235 13.0047C1.62858 13.0047 1.3349 13.2984 1.3349 13.6721V17.6768C1.3349 18.0506 1.62858 18.3443 2.00235 18.3443H12.6815C13.0553 18.3443 13.349 18.0506 13.349 17.6768V13.6721C13.349 13.2984 13.0553 13.0047 12.6815 13.0047H2.00235ZM2.6698 19.6792C1.9356 19.6792 1.3349 20.2799 1.3349 21.0141C1.3349 21.7483 1.9356 22.349 2.6698 22.349C3.40399 22.349 4.0047 21.7483 4.0047 21.0141C4.0047 20.2799 3.40399 19.6792 2.6698 19.6792ZM12.0141 19.6792C11.2799 19.6792 10.6792 20.2799 10.6792 21.0141C10.6792 21.7483 11.2799 22.349 12.0141 22.349C12.7483 22.349 13.349 21.7483 13.349 21.0141C13.349 20.2799 12.7483 19.6792 12.0141 19.6792ZM2.6698 11.0023C2.6698 11.3761 2.96348 11.6698 3.33725 11.6698H11.3466C11.7204 11.6698 12.0141 11.3761 12.0141 11.0023C12.0141 10.6286 11.7204 10.3349 11.3466 10.3349H3.33725C2.96348 10.3349 2.6698 10.6286 2.6698 11.0023Z"
                        fill={`${pathName === `/${statType}/system-wide` ? 'white' : '#8E8E8E'}`}
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
