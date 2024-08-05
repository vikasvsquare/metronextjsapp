'use client';
import { useState, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import MobileSideBar from './MobileSideBar';
import { useSession, signOut } from 'next-auth/react';
export default function MainHeader() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const [published, setPublished] = useState(true);
    const [showMegamenu, setShowMegamenu] = useState(false);
    const [showInnerMenu, setShowInnerMenu] = useState({
        rail: false,
        bus: false,
        systemWide: false
    });

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

    const createQueryString = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    function handleVettedToggle(value) {
        if (value) {
            setPublished(true);
            const query = new URLSearchParams({
                "line": "all",
                "type": "chart",
                "published": value
            }).toString();

            router.push(`${pathName}/?${query}`);

        } else {
            setPublished(false);
            router.push(pathName + '?' + createQueryString('type', 'chart'));
            router.push(pathName + '?' + createQueryString('published', value));
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-md bg-dark sticky-top border-bottom" data-bs-theme="dark">
                <div className="container">
                    <Link href="/" className="navbar-brand">
                        <Image
                            className="hidden lg:inline-block w-auto h-auto"
                            alt="Metro logo"
                            src="/assets/metro-logo.png"
                            width={172}
                            height={67}
                            priority
                            layout="intrinsic"
                            unoptimized
                        />
                        <Image
                            className="inline-block lg:hidden w-auto h-16"
                            alt="Metro logo"
                            src="/assets/metro-logo.png"
                            width={172}
                            height={67}
                            priority
                            layout="intrinsic"
                            unoptimized
                        />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvas"
                        aria-controls="offcanvas" aria-label="Toggle navigation" onClick={handleMegamenuToggle}>
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

                            {session ? (
                                <>

                                    <ul className="gap-4 ml-auto navbar-nav">
                                        <li className="nav-item">
                                            <button className={`${published ? 'active' : ''}`} onClick={() => handleVettedToggle(true)}>Published </button> |
                                            {/* <Link className="nav-link" href="#" target='_blank'>Published</Link> */}
                                        </li>
                                        <li className="nav-item">
                                            <button className={`${published ? '' : 'active'}`} onClick={() => handleVettedToggle(false)}>Unpublished </button>
                                            {/* <Link className="nav-link" href="#" target='_blank'>Unpublished</Link> */}
                                        </li>
                                        <li className="nav-item d-flex">
                                            <button onClick={() => signOut()}>Logout</button>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                // <a href="/login">Login</a>
                                <ul className="gap-4 m-auto navbar-nav">
                                    <li className="nav-item">
                                        <a className="nav-link" aria-current="page" href="https://www.metro.net/" target='_blank'>Ride</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://www.metro.net/" target='_blank'>Fares</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://www.metro.net/" target='_blank'>Project</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://www.metro.net/about/careers/" target='_blank'>Careers</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="https://www.metro.net/about/" target='_blank'>About Metro</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" href="https://www.metro.net/" target='_blank'>SSLE</a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {showMegamenu && (
                <MobileSideBar
                    hideMegamenu={hideMegamenu}
                    handleMegamenuToggle={handleMegamenuToggle}
                    handleInnerMenuToggle={handleInnerMenuToggle}
                    showInnerMenu={showInnerMenu}
                />
            )}
        </>
    );
}
