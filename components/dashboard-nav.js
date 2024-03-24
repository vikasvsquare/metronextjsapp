'use client'
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DashboardNvav() {
    const pathName = usePathname()
    console.log(pathName)
    return (

        <header>
            <div className="container">
                <div className="flex items-center justify-between gap-x-6">
                    <div className="basis-2/12">
                        <Link href="/">
                            <Image
                                className="hidden lg:inline-block"
                                alt="Metro logo"
                                src="/assets/metro-logo.png"
                                width={184}
                                height={65.71}
                                priority
                            />
                            <Image
                                className="inline-block lg:hidden h-16"
                                alt="Metro logo"
                                src="/assets/metro-logo-vertical.png"
                                width={80}
                                height={110}
                                priority
                            />
                        </Link>
                    </div>
                    <div className="basis-10/12 flex items-center lg:gap-x-12 py-6 lg:p-6 border-0 border-lg-l border-lg-b border-solid border-[#0099ff] rounded-bl-3xl">
                        <div className="basis-9/12 lg:basis-6/12 px-4 lg:px-10 py-1 lg:py-5 bg-slate-100 rounded-lg">
                            <h2 className="font-KoHo font-bold italic text-2xl lg:text-5xl flex items-center">
                                <span>CRIME</span>
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
                        </div>
                        <div className="hidden lg:flex items-center basis-3/12 lg:basis-6/12 p-2 gap-2 bg-slate-100 rounded-lg">
                            <Link href="/crime/rail"  className={"flex-auto bg-white rounded-lg px-4 py-2 flex items-center  " + (pathName === '/crime/rail' ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white' : 'text-black')}>
                                <span className="inline-block max-w-9 h-5 mr-4">
                                    <Image
                                        className="object-contain"
                                        alt="rail"
                                        src="/assets/rail.svg"
                                        width={18}
                                        height={23}
                                        priority
                                    />
                                </span>
                                <span>Rail</span>
                            </Link>
                            <Link href="/crime/bus"  className={"flex-auto bg-white rounded-lg px-4 py-2 flex items-center  " + (pathName === '/crime/bus' ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white' : 'text-black')}>
                                <span className="inline-block max-w-9 h-5 mr-4">
                                    <Image
                                        className="object-contain"
                                        alt="bus"
                                        src="/assets/bus.svg"
                                        width={18}
                                        height={23}
                                        priority
                                    />
                                </span>
                                <span>Bus</span>
                            </Link>
                            <Link href="/crime/system-wide"  className={"flex-auto bg-white rounded-lg px-4 py-2 flex items-center  " + (pathName === '/crime/system-wide' ? 'bg-gradient-to-r from-[#0189E1] from-[4.1%] to-[#014B7B] to-[87.17%] text-white' : 'text-black')}>
                                <span className="inline-block max-w-9 h-5 mr-4">
                                    <Image
                                        className="object-contain"
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
                    </div>
                </div>
            </div>
        </header>
    )
}
