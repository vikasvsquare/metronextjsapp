'use client';
import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import MobileSideBar from './MobileSideBar';
import { useSession, signOut } from 'next-auth/react';
import BoostrapModal from '../components/ui/BoostrapModal';

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

    // bootstrap modal 
    const [modalShow, setModalShow] = useState(false);
    const handleShow = () => setModalShow(true);
    const handleClose = () => setModalShow(false);

    const publishFlag = searchParams.get('published');
    useEffect(() => {
        if(typeof(publishFlag) === 'object'){
            setPublished(true)
          }
        if (publishFlag === "false") {
            setPublished(false);
        } else {
            setPublished(true);
        }
    }, [publishFlag])

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
                "published": value
            }).toString();

            router.push(`${pathName}/?${query}`);

        } else {
            setPublished(false);
            router.push(pathName + '?' + createQueryString('type', 'chart'));
            router.push(pathName + '?' + createQueryString('published', value));
        }
    }

    async function handleSignOut() {
        const data = await signOut({ redirect: false });
        if (data) {
            router.push('/')
        }
    }
    return (
        <>
            <BoostrapModal show={modalShow} handleClose={handleClose}>test</BoostrapModal>
            <nav className="navbar navbar-expand-md bg-dark sticky-top border-bottom" data-bs-theme="dark">
                <div className="container">
                <Link href="https://metro.net" className="flex items-center justify-center navbar-brand">
                        <svg className="transform rotate-180 block w-3 h-3 mx-1 text-gray-400 w-[24px] h-[24px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <Image
                            className="hidden lg:inline-block w-auto h-auto"
                            alt="Metro logo"
                            src="/assets/logo.svg"
                            width={172}
                            height={67}
                            priority
                            layout="intrinsic"
                            unoptimized
                        />
                        <Image
                            className="inline-block lg:hidden w-auto h-16"
                            alt="Metro logo"
                            src="/assets/logo.svg"
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

                        {session ? (
                            <div className="flex justify-center offcanvas-body">

                                <ul className="d-flex gap-4 items-center mr-auto navbar-nav">
                                    <li className="nav-item">
                                        <button className={`${published ? 'active' : ''}`} onClick={() => handleVettedToggle(true)}>Published </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className={`${published ? '' : 'active'}`} onClick={() => handleVettedToggle(false)}>Unpublished </button>
                                    </li>
                                </ul>
                                <ul className="d-flex gap-4 items-center ml-auto navbar-nav">
                                    <li className="nav-item d-flex">
                                        <button onClick={handleShow} className='btn btn-primary'>{published ? 'Un-Publish Data' : 'Publish Data'}</button>
                                    </li>
                                    <li className="nav-item d-flex">
                                        <button onClick={() => handleSignOut()} className='btn btn-secondary'>Logout</button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex offcanvas-body items-center justify-center mb-0 text-center">
                                <ol className="mb-0">
                                    <li className="inline-flex items-center">
                                        <a href="https://www.metro.net/riding/safety-security/" className="font-extrabold inline-flex items-center no-underline text-white text-xl">
                                            Safety Dashboard
                                        </a>
                                    </li>
                                </ol>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {
                showMegamenu && (
                    <MobileSideBar
                        hideMegamenu={hideMegamenu}
                        handleMegamenuToggle={handleMegamenuToggle}
                        handleInnerMenuToggle={handleInnerMenuToggle}
                        showInnerMenu={showInnerMenu}
                    />
                )
            }
        </>
    );
}
