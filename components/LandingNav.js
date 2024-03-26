'use client';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingNav() {
  const pathName = usePathname();
  // console.log(pathName);
  
  return (
    <header className="shadow-md">
      <div className="container">
        <div className="flex items-center justify-between gap-x-6 py-5">
          <div className="basis-2/12">
            <a href="/">
              <Image className="hidden lg:inline-block w-auto h-auto" alt="Metro logo" src="/assets/metro-logo.png" width={184} height={65.71} priority />
              <Image
                className="inline-block lg:hidden h-16"
                alt="Metro logo"
                src="/assets/metro-logo-vertical.png"
                width={80}
                height={110}
                priority
              />
            </a>
          </div>
          <div className="hidden lg:flex items-center basis-3/12 lg:basis-6/12 p-2 gap-2 bg-slate-100 rounded-6xl">
            <button className="flex-auto rounded-6xl px-4 py-2 flex items-center bg-black text-white">
              <span className="inline-block max-w-9 h-5 mr-4">
                <Image className="object-contain h-auto w-auto" alt="rail" src="/assets/rail.svg" width={18} height={23} priority />
              </span>
              <span>Rail</span>
            </button>
            <button className="flex-auto rounded-6xl px-4 py-2 flex items-center bg-white">
              <span className="inline-block max-w-9 h-5 mr-4">
                <Image className="object-contain h-auto w-auto" alt="bus" src="/assets/bus.svg" width={18} height={23} priority />
              </span>
              <span>Bus</span>
            </button>
            <button className="flex-auto rounded-6xl px-4 py-2 flex items-center bg-white">
              <span className="inline-block max-w-9 h-5 mr-4">
                <Image className="object-contain h-auto w-auto" alt="system wide" src="/assets/system-wide.svg" width={32} height={23} priority />
              </span>
              <span>System Wide</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
