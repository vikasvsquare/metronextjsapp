'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';

export default function MainHeader() {
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
        <nav className="navbar navbar-expand-md bg-dark sticky-top border-bottom" data-bs-theme="dark">
            <div className="container">
                <Link href="/" className="navbar-brand">
                    <Image
                        className="hidden lg:inline-block w-auto h-auto"
                        alt="Metro logo"
                        src="/assets/metro-logo.png"
                        width={184}
                        height={65.71}
                        priority
                    />
                    <Image
                        className="inline-block lg:hidden w-auto h-16"
                        alt="Metro logo"
                        src="/assets/metro-logo-vertical.png"
                        width={80}
                        height={110}
                        priority
                    />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"
                    aria-controls="offcanvas" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvas" aria-labelledby="offcanvasLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasLabel">
                            <img src="https://www.metro.net//wp-content/uploads/2021/02/icon-_-desktop-_-metrologo.svg" />
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="gap-4 m-auto navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" aria-current="page" href="#">Ride</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Fares</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Project</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">Careers</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#">About Metro</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active" href="#">SSLE</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>);
}
