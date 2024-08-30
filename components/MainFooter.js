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
                    <h6><Link href="https://www.metro.net/about/" target='_blank'> Metro</Link></h6>
                    <h6><Link href="https://www.metro.net/riding/fares/" target='_blank'>Fares and Passes</Link></h6>
                    <h6><Link href="https://thesource.metro.net/" target='_blank'>How to ride</Link></h6>
                    <h6><Link href="https://www.metro.net/riding/riders-disabilities/" target='_blank'>Accessibility</Link></h6>
                    <h6><Link href="https://thesource.metro.net/" target='_blank'>The Source</Link></h6>
                </div>
                <div className="col-6 col-md-3 d-flex flex-column gap-4 justify-content-start">
                    <h6><Link href="https://elpasajero.metro.net/" target='_blank'> Pasajero</Link></h6>
                    <h6><Link href="https://fisesss.metro.net/" target='_blank'>Employee Self Service</Link></h6>
                    <h6><Link href="https://fisesss.metro.net" target='_blank'>Metro Intranet</Link></h6>
                    <h6><Link href="https://developer.metro.net/" target='_blank'>Developer.metro.net</Link></h6>
                    <h6><Link href="/glossary">Glossary</Link></h6>
                </div>
            </div>
            <div className="row footer-sub mt-5">
                <div className="col-12 col-md text-left">
                    <span className="align-items-center d-flex gap-3 justify-content-start">
                        <Link href="https://www.metro.net/about/privacy-policy/" target='_blank'>Privacy Policy </Link><span className="border-end">&nbsp;</span><Link href="https://www.metro.net/about/copyright/"> Terms of
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
