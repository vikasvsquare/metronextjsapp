'use client'
import Link from 'next/link';
import Image from "next/image";
import LandingNav from '@/components/landing-nav';
import { useEffect } from "react";

export default function Home() {
  const test = true
  useEffect(() => {
    if (test) {
      getResponse();
    }
    async function getResponse() {
      const response = await fetch(
        'http://3.109.1.179:5000/dashboard_details?transport_type=Rail&published=true'
        , {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      // const data = await response.json();
      //    console.log(data);
      console.log(response);
    }
  }, [test]);

  // useEffect(() => {
  //   fetch('/api/profile-data')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data)
  //       setLoading(false)
  //     })
  // }, [])
  return (
    <>
      <LandingNav />
      <main className="min-h-screen overflow-hidden">
        <div className="relative lg:after:block lg:after:absolute lg:after:bg-black lg:after:w-full lg:after:h-full lg:after:-bottom-full lg:after:right-0">
          <div className="relative lg:absolute lg:z-10 lg:inset-0 lg:h-full w-full px-5 lg:px-0 lg:after:block lg:after:h-[310px] lg:after:w-full lg:after:bg-[url('/assets/triangle-curved-black.svg')] lg:after:bg-no-repeat lg:after:absolute lg:after:-bottom-1 lg:after:right-0">
            <h6 className="text-sm xl:text-lg italic text-slate-500 w-max pt-5 ml-auto">*Latest available data as on December 2023</h6>
            <div className="flex flex-wrap justify-center items-center h-96 lg:h-full py-5">
              <Image
                className="absolute top-1/2 -translate-y-1/2 right-0 lg:w-1/2"
                alt="Rail illustration"
                src="/assets/illustration-train.png"
                width={579}
                height={703}
                priority
              />
            </div>
          </div>
          <div className="container relative z-30">
            <div className="lg:flex px-8">
              <div className="lg:basis-1/2">
                <div className="relative bg-black pt-6 px-7 pb-7 lg:pt-9 lg:px-9 lg:pb-10 mt-20 rounded-6xl rounded-tl-none">
                  <span className="absolute z-10 -top-7 right-10">
                    <h6 className="text-sm text-blue-600">Read More</h6>
                  </span>
                  <div className="relative z-10 md:flex md:items-center">
                    <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                      <ul className="flex flex-wrap items-center justify-between">
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <h3 className="text-2xl text-yellow-300 font-semibold">1104</h3>
                          <h6 className="text-sm text-white font-semibold ml-5">Total Calls</h6>
                        </li>
                      </ul>
                    </div>
                    <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                      <ul className="flex flex-wrap items-center justify-between">
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">1107</h3>
                            <div className="flex flex-wrap items-center justify-around">
                              <span className="text-sm text-lime-400">(-0%)</span>
                              <svg width="8" height="11" viewBox="0 0 8 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M4.5 1C4.5 0.723858 4.27614 0.5 4 0.5C3.72386 0.5 3.5 0.723858 3.5 1H4.5ZM3.64645 10.3536C3.84171 10.5488 4.15829 10.5488 4.35355 10.3536L7.53553 7.17157C7.7308 6.97631 7.7308 6.65973 7.53553 6.46447C7.34027 6.2692 7.02369 6.2692 6.82843 6.46447L4 9.29289L1.17157 6.46447C0.976311 6.2692 0.659728 6.2692 0.464466 6.46447C0.269204 6.65973 0.269204 6.97631 0.464466 7.17157L3.64645 10.3536ZM3.5 1L3.5 10H4.5L4.5 1H3.5Z"
                                  fill="#3ACE00"
                                />
                              </svg>
                            </div>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">1032</h3>
                            <div className="flex flex-wrap items-center justify-around">
                              <span className="text-sm text-red-600">(7%)</span>
                              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                  fill="#FF0000"
                                />
                              </svg>
                            </div>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute z-30 -top-[15%] md:-top-1/4 translate-y-1/4 -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:p-5 rounded-4xl rounded-br-none shadow-lg border border-solid">
                    <h2 className="md:text-2xl xl:text-3xl">Calls for service</h2>
                  </div>
                </div>
                <div className="relative bg-black pt-6 px-7 pb-7 lg:pt-9 lg:px-9 lg:pb-10 mt-20 rounded-6xl rounded-tl-none">
                  <span className="absolute z-10 -top-7 right-10">
                    <h6 className="text-sm text-blue-600">Read More</h6>
                  </span>
                  <div className="relative z-10 md:flex md:items-center">
                    <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                      <ul className="flex flex-wrap items-center justify-between">
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <h3 className="text-2xl text-yellow-300 font-semibold">5M</h3>
                          <h6 className="text-sm text-white font-semibold ml-5">Boardings</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <h3 className="text-2xl text-yellow-300 font-semibold">1.31</h3>
                          <h6 className="text-sm text-white font-semibold ml-5">Crime per 100K Boardings</h6>
                        </li>
                      </ul>
                    </div>
                    <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                      <ul className="flex flex-wrap items-center justify-between">
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">322</h3>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Current Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">244</h3>
                            <div className="flex flex-wrap items-center justify-around">
                              <span className="text-sm text-red-600">(32%)</span>
                              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                  fill="#FF0000"
                                />
                              </svg>
                            </div>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">135</h3>
                            <div className="flex flex-wrap items-center justify-around">
                              <span className="text-sm text-red-600">(139%)</span>
                              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                  fill="#FF0000"
                                />
                              </svg>
                            </div>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute z-30 -top-[15%] md:-top-1/4 translate-y-1/4 -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:p-5 rounded-4xl rounded-br-none shadow-lg border border-solid">
                    <h2 className="md:text-2xl xl:text-3xl">Crime</h2>
                  </div>
                </div>
                <div className="relative bg-black pt-6 px-7 pb-7 lg:pt-9 lg:px-9 lg:pb-10 mt-20 rounded-6xl rounded-tl-none">
                  <span className="absolute z-10 -top-7 right-10">
                    <h6 className="text-sm text-blue-600">Read More</h6>
                  </span>
                  <div className="relative z-10 md:flex md:items-center">
                    <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                      <ul className="flex flex-wrap items-center justify-between">
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <h3 className="text-2xl text-yellow-300 font-semibold">266</h3>
                          <h6 className="text-sm text-white font-semibold ml-5">Total Arrest</h6>
                        </li>
                      </ul>
                    </div>
                    <div className="md:basis-1/2 md:px-5 md:even:border-l md:even:border-solid md:even:border-white">
                      <ul className="flex flex-wrap items-center justify-between">
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">196</h3>
                            <div className="flex flex-wrap items-center justify-around">
                              <span className="text-sm text-red-600">(36%)</span>
                              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                  fill="#FF0000"
                                />
                              </svg>
                            </div>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">131</h3>
                            <div className="flex flex-wrap items-center justify-around">
                              <span className="text-sm text-red-600">(103%)</span>
                              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M3.5 11C3.5 11.2761 3.72386 11.5 4 11.5C4.27614 11.5 4.5 11.2761 4.5 11H3.5ZM4.35355 0.646446C4.15829 0.451184 3.84171 0.451184 3.64645 0.646446L0.464466 3.82843C0.269204 4.02369 0.269204 4.34027 0.464466 4.53553C0.659728 4.7308 0.976311 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.7308 4.34027 7.7308 4.02369 7.53553 3.82843L4.35355 0.646446ZM4.5 11L4.5 1H3.5L3.5 11H4.5Z"
                                  fill="#FF0000"
                                />
                              </svg>
                            </div>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute z-30 -top-[15%] md:-top-1/4 translate-y-1/4 -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:p-5 rounded-4xl rounded-br-none shadow-lg border border-solid">
                    <h2 className="md:text-2xl xl:text-3xl">Arrest</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-12 flex justify-end">
              <button className="flex items-center bg-black lg:bg-white border border-solid rounded-6xl pl-9 py-3.5 pr-14 relative after:absolute after:h-2 after:w-5 after:bg-[url('/src/assets/arrow-right.svg')] after:bg-no-repeat after:bg-contain after:top-1/2 after:-translate-y-1/2 after:right-6">
                <Link className="text-base text-white lg:text-black font-bold" href="/crime/rail">Go To Dashboard</Link>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
