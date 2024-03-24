import Link from 'next/link';
import Image from "next/image";
import LandingNav from '@/components/landing-nav';

export default function Home() {
  return (
    <>
      <LandingNav />
      <main className="min-h-screen overflow-hidden">
        <div className='relative h lg:after:block lg:after:absolute lg:after:bg-black lg:after:w-full lg:after:h-full lg:after:-bottom-full lg:after:right-0'>
          <div className="absolute z-10 inset-0 h-full w-full lg:after:block lg:after:h-[310px] lg:after:w-full lg:after:bg-[url('/assets/triangle-curved-black.svg')] lg:after:bg-no-repeat lg:after:absolute lg:after:-bottom-1 lg:after:right-0">
            <Image
              className="absolute top-1/2 -translate-y-1/2 right-0 lg:w-1/2"
              alt="Rail illustration"
              src="/assets/illustration-train.png"
              width={579}
              height={703}
              priority
            />
          </div>
          <div className="container relative z-30">
            <h6 className="text-sm italic text-slate-500 w-max pt-5 ml-auto">*Latest available data as on December 2023</h6>
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
                            <span className="text-sm text-green-400">(-0%)</span>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">1032</h3>
                            <span className="text-sm text-red-400">(7%)</span>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute z-30 -top-[15%] md:-top-1/4 translate-y-1/4 -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:p-5 rounded-4xl rounded-br-none shadow-lg">
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
                            <span className="text-sm text-red-400">(32%)</span>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">135</h3>
                            <span className="text-sm text-red-400">(139%)</span>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute z-30 -top-[15%] md:-top-1/4 translate-y-1/4 -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:p-5 rounded-4xl rounded-br-none shadow-lg">
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
                            <span className="text-sm text-red-400">(36%)</span>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Month</h6>
                        </li>
                        <li className="inline-flex items-center justify-between mt-2.5">
                          <div>
                            <h3 className="text-2xl text-yellow-300 font-semibold">131</h3>
                            <span className="text-sm text-red-400">(103%)</span>
                          </div>
                          <h6 className="text-sm text-white font-semibold ml-5">Previous Year</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="absolute z-30 -top-[15%] md:-top-1/4 translate-y-1/4 -left-2 sm:-left-6 xl:-left-12 bg-white p-2.5 lg:p-5 rounded-4xl rounded-br-none shadow-lg">
                    <h2 className="md:text-2xl xl:text-3xl">Arrest</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-12 flex justify-end">
              <button className="rounded-6xl px-4 py-2 flex items-center bg-black lg:bg-white">
                <Link className="text-base text-white lg:text-black font-bold" href="/crime/rail">Go To Dashboard</Link>
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
