'use client'
import { useState } from 'react';
import DashboardNvav from "@/components/DashboardNav";

function Rail() {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDatePickerActive, setIsDatePickerActive] = useState(false);

  function handleDropdownToggle() {
    setIsDropdownActive((prevDatePickerState) => !prevDatePickerState);
  }

  function handleDatePickerClick() {
    setIsDatePickerActive((prevDatePickerState) => !prevDatePickerState);
  }

  return (
    <>
      <DashboardNvav />
      <div className="lg:flex lg:gap-8">
            <aside className="relative hidden lg:block lg:basis-3/12 pl-6 pt-6 bg-gradient-to-b from-[#050708] from-[-2.29%] to-[#0089E3] to-[90.57%] min-h-screen rounded-tr-3xl">
              <div>
                <div className="relative w-11/12 mr-4 before:inline-block before:w-3.5 before:h-3.5 before:bg-[url('/src/assets/icon-search.svg')] before:bg-contain before:absolute before:top-1/2 before:-translate-y-1/2 before:left-5">
                  <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Search Route"
                    className="w-full bg-transparent text-white border border-solid border-white rounded pl-12 py-2 px-4 placeholder:text-center"
                  />
                </div>
                <ul className="my-4">
                  <li>
                    <button className="bg-white text-blue-700 text-center font-bold rounded-l-2xl py-3 px-4 mr-4 w-full">All Lines</button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
                      A Line
                    </button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
                      B Line
                    </button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
                      C Line
                    </button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
                      D Line
                    </button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
                      E Line
                    </button>
                  </li>
                  <li>
                    <button className="bg-transparent text-white text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
                      K Line
                    </button>
                  </li>
                </ul>
              </div>
            </aside>
            <main className="lg:grow lg:basis-9/12 mt-14">
              <div className="flex flex-wrap items-center justify-between mb-5">
                <h2 className="basis-full sm:basis-6/12 text-2xl lg:text-3xl font-scala-sans font-semibold mt-5 lg:mt-0">All Lines</h2>
                <div className="basis-full sm:basis-6/12 -order-1 sm:order-none flex items-center p-2 gap-2 bg-slate-100 rounded-lg">
                  <button className="flex-auto bg-white rounded-lg px-4 py-2 flex justify-center items-center bg-gradient-to-r from-[#040E15] from-[5.5%] to-[#17527B] to-[93.69%] text-white">
                    <span>Vetted Data</span>
                  </button>
                  <button className="flex-auto rounded-lg px-4 py-2 flex justify-center items-center">
                    <span>Unvetted Data</span>
                  </button>
                </div>
              </div>
              <p className="text-sm lg:text-base text-slate-500 mb-10">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              </p>
              <div className="relative z-30">
                <h5 className="text-lg text-slate-400 mb-4">Select Time Range</h5>
                <div className="md:flex md:items-center py-2 px-5 rounded-xl bg-gradient-to-r from-[#EAF7FF] from-[0%] to-[#ADDFFF] to-[106.61%]">
                  <div className="md:basis-3/12">
                    <div className="relative min-h-11">
                      <div
                        className="absolute w-full h-auto top-0 left-0 p-2.5 flex-auto rounded-lg bg-[#032A43] text-white"
                        onClick={handleDatePickerClick}
                      >
                        <span className="flex justify-center items-center min-h-6">Select Date</span>
                        {isDatePickerActive && (
                          <ul className="flex flex-col bg-white rounded-lg px-2.5 pb-4 mt-2">
                            <li className="block py-2.5 border-b border-solid border-slate-300">
                              <label className="flex justify-start text-black px-2.5">
                                <input type="checkbox" className="mr-5" name="2024" id="2024" />
                                <span>2024</span>
                                <span></span>
                              </label>
                              <ul className="flex flex-col bg-sky-100 rounded-lg px-1.5 pb-4 mt-2">
                                <li className="block p-1.5 border-b border-solid border-slate-300">
                                  <label className="flex justify-start text-black px-1.5">
                                    <input type="checkbox" className="mr-3" name="jan" id="jan" />
                                    <span>Jan</span>
                                    <span></span>
                                  </label>
                                </li>
                                <li className="block p-1.5 border-b border-solid border-slate-300">
                                  <label className="flex justify-start text-black px-1.5">
                                    <input type="checkbox" className="mr-3" name="feb" id="feb" />
                                    <span>Feb</span>
                                    <span></span>
                                  </label>
                                </li>
                                <li className="block p-1.5 border-b border-solid border-slate-300">
                                  <label className="flex justify-start text-black px-1.5">
                                    <input type="checkbox" className="mr-3" name="mar" id="mar" />
                                    <span>Mar</span>
                                    <span></span>
                                  </label>
                                </li>
                              </ul>
                            </li>
                            <li className="block p-2.5 text-black border-b border-solid border-slate-300">2023</li>
                            <li className="block p-2.5 text-black border-b border-solid border-slate-300">2022</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="md:basis-1/12 xl:basis-2/12 hidden md:block xl:flex xl:justify-center xl:items-center">
                    <span className="hidden xl:inline-block xl:w-px xl:h-10 xl:bg-black"></span>
                  </div>
                  <div className="md:basis-8/12 xl:basis-7/12 mt-5 md:mt-0">
                    <ul className="flex justify-between md:justify-start items-center md:gap-6">
                      <li>
                        <button className="bg-white py-1 px-2 lg:py-3 lg:px-4 rounded-lg text-xs font-bold">This week</button>
                      </li>
                      <li>
                        <button className="text-xs font-bold">Last Quarter</button>
                      </li>
                      <li>
                        <button className="text-xs font-bold">This month</button>
                      </li>
                      <li>
                        <button className="text-xs font-bold">Previous Month</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex justify-end mt-4">
                <button className="inline-block rounded-lg pl-5 py-2 pr-11 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/src/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:right-6">
                  <span>Export All</span>
                </button>
              </div>
              <div id="content" className="relative z-10 bg-sky-100 p-7 lg:py-8 lg:px-16 mt-10 rounded-2xl">
                <div className="flex flex-wrap items-center">
                  <div className="basis-10/12 xl:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900 relative pl-8 before:block before:w-3.5 before:h-3.5 before:bg-[#0166A8] before:rounded-full before:absolute before:top-1/2 before:-translate-y-1/2 before:left-0">
                      Serious Crime
                    </h2>
                  </div>
                  <div className="basis-2/12 xl:basis-1/12 flex justify-end xl:order-3">
                    <button className="inline-block rounded-lg p-5 flex justify-center items-center bg-white text-slate-500 font-semibold shadow-md relative after:absolute after:h-3 after:w-3 after:bg-[url('/src/assets/icon-export.svg')] after:bg-contain after:top-1/2 after:-translate-y-1/2 after:left-1/2 after:-translate-x-1/2"></button>
                  </div>
                  <div className="basis-full sm:basis-10/12 xl:basis-7/12 mt-5 xl:mt-0">
                    <ul className="flex justify-between md:justify-start items-center md:gap-6">
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          All
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-black font-bold">
                          On Person
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          Property Related Crime
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          Society
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempo
                </p>
                <div className="h-[250px]"></div>
              </div>
              <div id="content" className="bg-sky-100 p-7 lg:py-8 lg:px-16 mt-10 rounded-2xl">
                <div className="lg:flex lg:items-center">
                  <div className="lg:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900">General Crime</h2>
                  </div>
                  <div className="mt-5 lg:mt-0 lg:basis-6/12">
                    <ul className="flex items-center justify-between">
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          All
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-black font-bold">
                          On Person
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          Property Related Crime
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          Society
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="basis-2/12"></div>
                </div>
                <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempo
                </p>
                <div className="h-[250px]"></div>
              </div>
              <div id="content" className="bg-sky-100 p-7 lg:py-8 lg:px-16 mt-10 rounded-2xl">
                <div className="lg:flex lg:items-center">
                  <div className="lg:basis-4/12">
                    <h2 className="text-xl lg:text-2xl italic font-scala-sans font-medium text-blue-900">Agency Wide Analysis</h2>
                  </div>
                  <div className="mt-5 lg:mt-0 lg:basis-6/12">
                    <ul className="flex items-center justify-between">
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          All
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-black font-bold">
                          On Person
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          Property Related Crime
                        </a>
                      </li>
                      <li>
                        <a href="" className="text-xs lg:text-base text-slate-500">
                          Society
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="basis-2/12"></div>
                </div>
                <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore Lorem ipsum sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempo
                </p>
                <div className="h-[250px]"></div>
              </div>
            </main>
          </div>
    </>
  );
}

export default Rail;