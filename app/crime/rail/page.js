import Image from "next/image";

function Rail() {
  return (
    <>
        <div className="lg:flex lg:gap-8">
          <aside className="main-sidebar relative hidden lg:block lg:basis-1/5 pl-6 pt-6 bg-gradient-to-b from-[#050708] from-[-2.29%] to-[#0089E3] to-[90.57%] min-h-screen rounded-tr-3xl">
            <div>
              <input
                type="search"
                name="search"
                id="search"
                placeholder="Search Route"
                className="bg-transparent text-white border border-solid border-white rounded py-2 px-4 mr-4 w-11/12"
              />
              <ul className="my-4">
                <li>
                  <button className="bg-white text-blue-700 text-center font-medium rounded-l-2xl py-3 px-4 mr-4 w-full">
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
          <main className="lg:grow lg:basis-4/5 mt-14">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-5">
              A Line ( Blue )
            </h2>
            <p className="text-sm lg:text-base text-slate-500 mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et{" "}
            </p>
            <div id="filters">
              <h5 className="text-lg text-slate-400 mb-4">Select Time Range</h5>
              <div
                id="filter-box"
                className="lg:flex p-5 rounded-xl bg-gradient-to-r from-[#EAF7FF] from-[0%] to-[#ADDFFF] to-[106.61%]"
              >
                <div
                  id="date-filter"
                  className="lg:flex lg:gap-5 items-center lg:basis-7/12"
                >
                  <div
                    id="date-box"
                    className="inline-flex justify-between items-center w-full lg:w-fit lg:basis-6/12 bg-white rounded-lg py-1 px-4"
                  >
                    <span
                      id="date-icon"
                      className="inline-block max-w-5 h-5 mr-3"
                    >
                      <Image
                        className="object-contain"
                        alt="calendar"
                        src="/assets/calendar.svg"
                        width={200}
                        height={100}
                        priority
                      />
                    </span>
                    <span id="date-from" className="text-slate-400 text-xs">
                      Jan 20, 2024
                    </span>
                    <span className="text-slate-400 text-xs">-</span>
                    <span id="date-to" className="text-slate-400 text-xs">
                      Feb 09, 2024
                    </span>
                  </div>
                  <div id="input-box" className="mt-5 lg:mt-0 lg:basis-6/12">
                    <input
                      type="range"
                      name="date"
                      id="date"
                      className="w-full lg:w-fit"
                    />
                  </div>
                </div>
                <div id="month-filter" className="mt-5 lg:mt-0 lg:basis-5/12">
                  <ul className="flex justify-between items-center lg:gap-2">
                    <li>
                      <button className="bg-white py-1 px-2 lg:py-2 lg:px-4 rounded-lg text-xs font-bold">
                        This week
                      </button>
                    </li>
                    <li>
                      <button className="text-xs font-bold">
                        Last Quarter
                      </button>
                    </li>
                    <li>
                      <button className="text-xs font-bold">This month</button>
                    </li>
                    <li>
                      <button className="text-xs font-bold">
                        Previous Month
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div
              id="content"
              className="bg-sky-100 p-7 lg:py-8 lg:px-16 mt-10 rounded-2xl"
            >
              <div className="lg:flex lg:items-center">
                <div className="lg:basis-4/12">
                  <h2 className="text-xl lg:text-2xl italic font-medium text-blue-900">
                    Serious Crime
                  </h2>
                </div>
                <div className="mt-5 lg:mt-0 lg:basis-6/12">
                  <ul className="flex items-center justify-between">
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        All
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-black font-bold"
                      >
                        On Person
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        Property Related Crime
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        Society
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="basis-2/12"></div>
              </div>
              <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore Lorem ipsum sit amet,
                consectetur adipiscing elit, sed do eiusmod tempo
              </p>
              <div className="h-[250px]"></div>
            </div>
            <div
              id="content"
              className="bg-sky-100 p-7 lg:py-8 lg:px-16 mt-10 rounded-2xl"
            >
              <div className="lg:flex lg:items-center">
                <div className="lg:basis-4/12">
                  <h2 className="text-xl lg:text-2xl italic font-medium text-blue-900">
                    General Crime
                  </h2>
                </div>
                <div className="mt-5 lg:mt-0 lg:basis-6/12">
                  <ul className="flex items-center justify-between">
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        All
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-black font-bold"
                      >
                        On Person
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        Property Related Crime
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        Society
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="basis-2/12"></div>
              </div>
              <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore Lorem ipsum sit amet,
                consectetur adipiscing elit, sed do eiusmod tempo
              </p>
              <div className="h-[250px]"></div>
            </div>
            <div
              id="content"
              className="bg-sky-100 p-7 lg:py-8 lg:px-16 mt-10 rounded-2xl"
            >
              <div className="lg:flex lg:items-center">
                <div className="lg:basis-4/12">
                  <h2 className="text-xl lg:text-2xl italic font-medium text-blue-900">
                    Agency Wide Analysis
                  </h2>
                </div>
                <div className="mt-5 lg:mt-0 lg:basis-6/12">
                  <ul className="flex items-center justify-between">
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        All
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-black font-bold"
                      >
                        On Person
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        Property Related Crime
                      </a>
                    </li>
                    <li>
                      <a
                        href=""
                        className="text-xs lg:text-base text-slate-500"
                      >
                        Society
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="basis-2/12"></div>
              </div>
              <p className="bg-white py-2 px-4 text-sm lg:text-base text-slate-400 rounded-lg mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore Lorem ipsum sit amet,
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