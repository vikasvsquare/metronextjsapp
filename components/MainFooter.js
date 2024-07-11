'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';

export default function MainFooter() {
  const pathName = usePathname();
  const [showMegamenu, setShowMegamenu] = useState(false);

  function handleMegamenuToggle() {
    document.body.classList.toggle('overflow-hidden');
    setShowMegamenu((prevMegamenuState) => !prevMegamenuState);
  }

  function hideMegamenu() {
    document.body.classList.remove('overflow-hidden');
    setShowMegamenu(false);
  }

  return (
    <footer className="footer mt-auto">
        <div className="container">
            <div className="row">
                <div className="col-6 col-md-3 d-flex flex-column gap-4 justify-content-start">
                    <h6><Link href="/"> Metro</Link></h6>
                    <h6><Link href="/">Fares and Passes</Link></h6>
                    <h6><Link href="/">How to ride</Link></h6>
                    <h6><Link href="/">Accessibility</Link></h6>
                    <h6><Link href="/">The Source</Link></h6>
                </div>
                <div className="col-6 col-md-3 d-flex flex-column gap-4 justify-content-start">
                    <h6><Link href="/"> Pasajero</Link></h6>
                    <h6><Link href="/">Employee Self Service</Link></h6>
                    <h6><Link href="/">Metro Intranet</Link></h6>
                    <h6><Link href="/">Crime definition & Glossary</Link></h6>
                </div>
            </div>
            <div className="row footer-sub mt-5">
                <div className="col-12 col-md text-left">
                    <span className="align-items-center d-flex gap-3 justify-content-start">
                        <Link href="/">Privacy Policy </Link><span className="border-end">&nbsp;</span><Link href="/"> Terms of
                            use</Link>
                    </span>
                    <br />
                    <span>Copyright ©2024 Metro</span>
                </div>
            </div>
        </div>
    </footer>
     );
}
